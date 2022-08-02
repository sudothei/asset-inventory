use crate::error::bad_input;
use crate::models::{
    Claims, PasswordInsert, PasswordSetRequest, RequestFormData, SecurityToken, User, UserOid,
    UserToken,
};
use actix_web::web::Json;
use actix_web::{get, post, put, web, HttpResponse, Responder};
use chrono::Utc;
use core::time::Duration;
use jsonwebtoken::{encode, EncodingKey, Header};
use lettre::message::{header::ContentType, Mailbox, SinglePartBuilder};
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use std::env;
use std::sync::*;
use std::time::{SystemTime, UNIX_EPOCH};

/// set a user's password `/api/users`
#[put("/api/password")]
pub async fn set_password(
    data: web::Data<Mutex<Database>>,
    post_data: Json<PasswordSetRequest>,
) -> impl Responder {
    // grab the values from the post data
    let oid = post_data.oid.to_string();
    let token = post_data.token.to_string();
    let password = post_data.password.to_string();

    // grab the user from the database
    let db = data.lock().unwrap();
    let user_collection = db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(oid).unwrap() };
    let user = user_collection
        .find_one(filter.clone(), None)
        .await
        .unwrap()
        .unwrap();

    // verify that the security token is correct
    // and verify that the expiry isn't passed
    let start = SystemTime::now();
    let now = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();
    let bcrypt_cost_factor =
        env::var("BCRYPT_COST_FACTOR").expect("BCRYPT_COST_FACTOR must be set");
    if user.security_token.token == token.to_string() && now < user.security_token.expires {
        // Hash the password and insert into DB
        let password_hash = match bcrypt::hash(&password, bcrypt_cost_factor.parse().unwrap()) {
            Ok(hashed) => hashed,
            Err(e) => {
                return HttpResponse::InternalServerError()
                    .content_type("text")
                    .body(e.to_string())
            }
        };
        let password_collection = db.collection::<PasswordInsert>("users");
        let password_insert = PasswordInsert {
            password_hash: password_hash.to_string(),
            status: "Active".to_string(),
        };
        let hash_doc = doc! {"$set": bson::to_document(&password_insert).unwrap()};
        let password_result = password_collection
            .update_one(filter.clone(), hash_doc, None)
            .await;
        match password_result {
            Ok(_rs) => {}
            Err(err) => {
                let mongo_err = bad_input(err);
                return HttpResponse::UnprocessableEntity()
                    .content_type("text")
                    .body(mongo_err);
            }
        }

        // Set the token expiration to 0 to prevent reuse
        let token_collection = db.collection::<UserToken>("users");
        let security_token = SecurityToken {
            token: user.security_token.token,
            expires: 0,
        };
        let set_user_token = UserToken {
            security_token: security_token,
        };
        let expiry_doc = doc! {"$set": bson::to_document(&set_user_token).unwrap()};
        let expiry_result = token_collection.update_one(filter, expiry_doc, None).await;

        // Return the _id of the updated user
        match expiry_result {
            Ok(_rs) => {
                // Make the jwt
                let secret = env::var("SECRET").expect("SECRET must be set").into_bytes();
                let expiration_time = Utc::now()
                    .checked_add_signed(chrono::Duration::days(1))
                    .expect("invalid timestamp")
                    .timestamp();
                let user_claims = Claims {
                    oid: user._id.to_string().clone(),
                    admin: user.admin.clone(),
                    write: user.write.clone(),
                    exp: expiration_time as usize,
                };
                let token = match encode(
                    &Header::default(),
                    &user_claims,
                    &EncodingKey::from_secret(&secret),
                ) {
                    Ok(t) => t,
                    Err(_) => {
                        return HttpResponse::Forbidden()
                            .content_type("text")
                            .body("Forbiden")
                    }
                };

                // Send the jwt in the Authorization header
                HttpResponse::Ok()
                    .content_type("text")
                    .insert_header(("Authorization", format!("Bearer {}", token)))
                    .body(token)
            }
            Err(err) => {
                let mongo_err = bad_input(err);
                HttpResponse::UnprocessableEntity()
                    .content_type("text")
                    .body(mongo_err)
            }
        }
    } else {
        HttpResponse::Forbidden()
            .content_type("text")
            .body("Forbiden")
    }
}

/// get a users's password reset form data `/api/users`
#[post("/api/password")]
pub async fn request_form(
    data: web::Data<Mutex<Database>>,
    post_data: Json<RequestFormData>,
) -> impl Responder {
    // grab the data from the post request
    let oid = post_data.oid.to_string();
    let token = post_data.token.to_string();

    // grab the user from the DB
    let db = data.lock().unwrap();
    let user_collection = db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(oid).unwrap() };
    let user = user_collection
        .find_one(filter, None)
        .await
        .unwrap()
        .unwrap();

    // verify that the security token is correct
    // and verify that the expiry isn't passed
    let start = SystemTime::now();
    let now = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();
    if user.security_token.token == token.to_string() && now < user.security_token.expires {
        // Send the non-sensitive user details to populate the form
        HttpResponse::Ok()
            .content_type("application/json")
            .json(user)
    } else {
        HttpResponse::Forbidden()
            .content_type("text")
            .body("Forbiden")
    }
}

/// request a password set email `/api/setpassword`
#[get("/api/password/{email}")]
pub async fn request_email(
    email: web::Path<String>,
    data: web::Data<Mutex<Database>>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<UserToken>("users");

    // First generate a security token for the user
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let expires = since_the_epoch.as_secs() + (60 * 60 * 24 * 7);
    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(32)
        .map(char::from)
        .collect();
    let security_token = SecurityToken {
        token: token.clone(),
        expires: expires,
    };
    let set_user_token = UserToken {
        security_token: security_token,
    };
    let filter = doc! {"email": email.to_string()};
    let data = doc! {"$set": bson::to_document(&set_user_token).unwrap()};
    let db_result = user_collection.update_one(filter.clone(), data, None).await;
    match db_result {
        Ok(_rs) => {}
        Err(err) => {
            let mongo_err = bad_input(err);
            return HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err);
        }
    }

    // Get the user's oid from the database
    let user_oid_collection = db.collection::<UserOid>("users");
    let user_result = user_oid_collection.find_one(filter, None).await;
    let user_oid: String;
    match user_result {
        Ok(rs) => user_oid = rs.unwrap()._id.to_string(),
        Err(err) => {
            let mongo_err = bad_input(err);
            return HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err);
        }
    }

    // Construct and send the password set email

    let smtp_from: String = env::var("SMTP_FROM").expect("SMTP_FROM must be set");
    let smtp_server: String = env::var("SMTP_SERVER").expect("SMTP_SERVER must be set");
    let smtp_use_tls: String = env::var("SMTP_USE_TLS").expect("SMTP_USE_TLS must be set");
    let server_hostname: String = env::var("SERVER_HOSTNAME").expect("SERVER_HOSTNAME must be set");
    let body: String = format!(
        r#"
            <p>Please set your password using the following link.</p>
            <a =href="https://{hostname}/setpassword/{oid}/{token}">https://{hostname}/setpassword/{oid}/{token}</a>
            <p>This link will expire in 7 days</p>
        "#,
        hostname = server_hostname,
        token = token,
        oid = user_oid
    );

    let message = Message::builder()
        .from(Mailbox::new(None, smtp_from.parse().unwrap()))
        .to(Mailbox::new(None, email.clone().parse().unwrap()))
        .subject("Set your password using this link")
        .singlepart(
            SinglePartBuilder::new()
                .content_type(ContentType::TEXT_HTML)
                .body(body),
        )
        .unwrap();

    let mailer: lettre::AsyncSmtpTransport<_>;
    if smtp_use_tls == "Y" {
        mailer = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&smtp_server)
            .unwrap()
            .timeout(Some(Duration::from_secs(1)))
            .build();
    } else {
        mailer = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous(&smtp_server)
            .timeout(Some(Duration::from_secs(1)))
            .build();
    }

    let result = mailer.send(message).await;
    match result {
        Ok(_rs) => HttpResponse::Ok()
            .content_type("application/json")
            .json("Success"),
        Err(err) => HttpResponse::InternalServerError()
            .content_type("text")
            .body(err.to_string()),
    }
}
