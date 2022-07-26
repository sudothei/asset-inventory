use crate::helpers::bad_input;
use actix_web::{get, web, HttpResponse, Responder};
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
pub struct SecurityToken {
    pub token: String,
    pub expires: u64,
}

#[derive(Serialize, Deserialize)]
pub struct SetUserToken {
    pub security_token: SecurityToken,
}

#[derive(Serialize, Deserialize)]
pub struct UserEmail {
    pub email: String,
}

/// request a password set email `/api/setpassword`
#[get("/api/password/{id}")]
pub async fn request_email(
    id: web::Path<String>,
    data: web::Data<Mutex<Database>>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<SetUserToken>("users");

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
    let set_user_token = SetUserToken {
        security_token: security_token,
    };
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
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

    // Get the user's email from the database
    let user_email_collection = db.collection::<UserEmail>("users");
    let user_result = user_email_collection.find_one(filter, None).await;
    let user_email: String;
    match user_result {
        Ok(rs) => user_email = rs.unwrap().email,
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
            <a =href="https://{hostname}/setpassword/{token}">https://{hostname}/setpassword/{token}</a>
            <p>This link will expire in 7 days</p>
        "#,
        hostname = server_hostname,
        token = token
    );

    let email = Message::builder()
        .from(Mailbox::new(None, smtp_from.parse().unwrap()))
        .to(Mailbox::new(None, user_email.clone().parse().unwrap()))
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

    let result = mailer.send(email).await;
    match result {
        Ok(_rs) => HttpResponse::Ok()
            .content_type("application/json")
            .json("Success"),
        Err(err) => HttpResponse::InternalServerError()
            .content_type("text")
            .body(err.to_string()),
    }
}
