use crate::models::{AdminInsert, Admins, Claims};
use actix_web::web;
use actix_web::HttpRequest;
use chrono::Utc;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mongodb::{bson::doc, Database};
use std::env;
use std::sync::*;

pub fn get_token(req: HttpRequest) -> Option<Claims> {
    let auth_key: String;
    if req.headers().contains_key("Authorization") {
        auth_key = "Authorization".to_string();
    } else if req.headers().contains_key("Authorization") {
        auth_key = "authorization".to_string();
    } else {
        auth_key = "AUTHORIZATION".to_string();
    }

    if let Some(auth_header) = req.headers().get(auth_key) {
        if let Ok(auth_value) = auth_header.to_str() {
            if auth_value.starts_with("bearer") || auth_value.starts_with("Bearer") {
                let token = auth_value[6..auth_value.len()].trim();
                let secret = env::var("SECRET").unwrap().into_bytes();
                if let Ok(token_contents) = decode::<Claims>(
                    &token.to_string(),
                    &DecodingKey::from_secret(&secret),
                    &Validation::new(Algorithm::HS256),
                ) {
                    let now = Utc::now().timestamp() as usize;
                    if now < token_contents.claims.exp {
                        return Some(token_contents.claims);
                    }
                }
            }
        }
    }
    return None;
}

pub async fn create_initial_admin(database: web::Data<Mutex<Database>>) {
    let db = database.lock().unwrap();

    let admins_collection = db.collection::<Admins>("users");

    let filter = doc! { "admin": true };
    let admins_result = admins_collection
        .find_one(filter.clone(), None)
        .await
        .unwrap();

    match admins_result {
        Some(_rs) => return,
        None => {}
    }

    let bcrypt_cost_factor =
        env::var("BCRYPT_COST_FACTOR").expect("BCRYPT_COST_FACTOR must be set");
    let password_hash = bcrypt::hash("admin", bcrypt_cost_factor.parse().unwrap())
        .expect("Could not hash initial admin password");

    let new_user = AdminInsert {
        status: "Active".to_string(),
        firstname: "admin".to_string(),
        lastname: "admin".to_string(),
        email: "admin".to_string(),
        admin: true,
        write: true,
        password_hash: password_hash.to_string(),
    };

    let admin_insert_collection = db.collection::<AdminInsert>("users");
    admin_insert_collection
        .insert_one(new_user, None)
        .await
        .expect("There was a problem inserting the initial admin into the database");

    println!("Initial admin account created succcessfully, please remember to delete after use.");
}
