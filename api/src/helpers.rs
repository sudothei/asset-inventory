use actix_web::HttpRequest;
use chrono::Utc;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub oid: String,
    pub admin: bool,
    pub write: bool,
    pub exp: usize,
}

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
