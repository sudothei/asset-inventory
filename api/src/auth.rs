use actix_web::web::Json;
use actix_web::{post, web, HttpResponse, Responder};
use bcrypt::verify;
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::*;

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub oid: String,
    pub admin: bool,
    pub write: bool,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct UserEmail {
    pub email: String,
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
    let filter = doc! {"email": email};
    let user = match user_collection.find_one(filter, None).await {
        Ok(rs) => rs.unwrap(),
        // 302 if user not present to prevent email enumeration
        Err(_err) => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Forbiden")
        }
    };

    // verify that the password is correct
    let valid = verify(password, &user.password_hash);
    match valid {
        Ok(_rs) => {
            // Make the jwt
            let secret = env::var("SECRET").expect("SECRET must be set").into_bytes();
            let expiration_time = Utc::now()
                .checked_add_signed(Duration::days(1))
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
                Err(_err) => {
                    return HttpResponse::Unauthorized()
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
        Err(_err) => HttpResponse::Unauthorized()
            .content_type("text")
            .body("Forbiden"),
    }
}
