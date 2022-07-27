use crate::helpers::bad_input;
use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse, Responder};
use lettre::message::{header::ContentType, Mailbox, SinglePartBuilder};
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::*;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub _id: ObjectId,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: String,
    pub security_token: SecurityToken,
}

#[derive(Serialize, Deserialize)]
pub struct SecurityToken {
    pub token: String,
    pub expires: u64,
}

#[derive(Serialize, Deserialize)]
pub struct UserToken {
    pub security_token: SecurityToken,
}

#[derive(Serialize, Deserialize)]
pub struct UserOid {
    pub _id: ObjectId,
}

#[derive(Serialize, Deserialize)]
pub struct RequestFormData {
    pub oid: String,
    pub token: String,
}

/// get a users's password reset form data `/api/users/{id}/{token}`
#[post("/api/password")]
pub async fn request_form(
    data: web::Data<Mutex<Database>>,
    post_data: Json<RequestFormData>,
) -> impl Responder {
    let oid = post_data.oid.to_string();
    let token = post_data.token.to_string();
    let db = data.lock().unwrap();
    let user_collection = db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(oid).unwrap() };
    let user = user_collection
        .find_one(filter, None)
        .await
        .unwrap()
        .unwrap();
    if user.security_token.token == token.to_string() {
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
            .build();
    } else {
        mailer = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous(&smtp_server)
            .port(25)
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
