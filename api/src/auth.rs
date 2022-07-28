use actix_web::web::Json;
use actix_web::{post, web, HttpResponse, Responder};
use bcrypt::verify;
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::*;

use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub oid: String,
    pub admin: bool,
    pub write: bool,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct UserCreds {
    pub _id: ObjectId,
    pub email: String,
    pub password_hash: String,
    pub admin: bool,
    pub write: bool,
}

#[derive(Serialize, Deserialize)]
pub struct LoginData {
    pub email: String,
    pub password: String,
}

/// get a users's password reset form data `/api/users`
#[post("/api/login")]
pub async fn login(data: web::Data<Mutex<Database>>, post_data: Json<LoginData>) -> impl Responder {
    // grab the data from the post request
    let email = post_data.email.to_string();
    let password = post_data.password.to_string();

    // grab the user from the DB
    let db = data.lock().unwrap();
    let user_collection = db.collection::<UserCreds>("users");
    let filter = doc! {"email": email.to_string()};
    let user = user_collection
        .find_one(filter, None)
        .await
        .unwrap()
        .unwrap();

    // verify that the password is correct
    let valid = verify(password, &user.password_hash);
    match valid {
        Ok(_rs) => {
            // Make the jwt
            let secret = env::var("SECRET").unwrap().into_bytes();
            let expiration_time = Utc::now()
                .checked_add_signed(Duration::seconds(60))
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
                Err(_) => panic!(),
            };

            // Send the jwt
            HttpResponse::Ok().content_type("text").body(token)
        }
        Err(_err) => HttpResponse::Unauthorized()
            .content_type("text")
            .body("Forbiden"),
    }
}
