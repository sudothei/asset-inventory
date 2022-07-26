use crate::helpers::bad_input;
use actix_web::web::Json;
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use lettre::message::{header::ContentType, Mailbox, SinglePartBuilder};
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::*;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio_stream::StreamExt;

#[derive(Serialize, Deserialize)]
pub struct SecurityToken {
    pub token: String,
    pub expires: u64,
}

#[derive(Serialize, Deserialize)]
pub struct ExistingUser {
    pub _id: ObjectId,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
}

#[derive(Serialize, Deserialize)]
pub struct UserAddRequest {
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: Option<String>,
    pub security_token: Option<SecurityToken>,
}

/// list all users `/users`
#[get("/api/users")]
pub async fn list(data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<ExistingUser>("users");
    let cursor = user_collection.find(None, None).await.unwrap();

    let results: Vec<Result<ExistingUser, mongodb::error::Error>> = cursor.collect().await;
    let users: Vec<ExistingUser> = results.into_iter().map(|d| d.unwrap()).collect();

    HttpResponse::Ok()
        .content_type("application/json")
        .json(users)
}

/// create a user `/users`
#[post("/api/users")]
pub async fn create(
    data: web::Data<Mutex<Database>>,
    user_req: Json<UserAddRequest>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection("users");

    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let expires = since_the_epoch.as_secs() + (60 * 60 * 24 * 7);

    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(30)
        .map(char::from)
        .collect();

    let security_token = SecurityToken {
        token: token.clone(),
        expires: expires,
    };

    let new_user = UserAddRequest {
        status: Some("Pending".to_string()),
        security_token: Some(security_token),
        ..user_req.into_inner()
    };

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
        .to(Mailbox::new(None, new_user.email.clone().parse().unwrap()))
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

    let mail_result = mailer.send(email).await;
    match mail_result {
        Ok(rs) => println!("{:?}", rs),
        Err(err) => println!("{:?}", err),
    }

    let result = user_collection.insert_one(new_user, None).await;
    match result {
        Ok(rs) => {
            let new_id = rs.inserted_id.as_object_id();
            HttpResponse::Ok()
                .content_type("application/json")
                .json(new_id)
        }
        Err(err) => {
            let mongo_err = bad_input(err);
            HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err)
        }
    }
}

/// delete a user `/users/{id}`
#[delete("/api/users/{id}")]
pub async fn delete(id: web::Path<String>, data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<ExistingUser>("users");
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
    let result = user_collection.delete_one(filter, None).await;
    match result {
        Ok(rs) => HttpResponse::Ok().content_type("application/json").json(rs),
        Err(err) => {
            let mongo_err = bad_input(err);
            HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err)
        }
    }
}
