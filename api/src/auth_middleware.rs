use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    error::ErrorUnauthorized,
    http::Method,
    Error,
};
use futures_util::future::LocalBoxFuture;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;
use std::future::{ready, Ready};

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub oid: String,
    pub admin: bool,
    pub write: bool,
    pub exp: usize,
}

pub struct Auth;

impl<S, B> Transform<S, ServiceRequest> for Auth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddleware { service }))
    }
}

pub struct AuthMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let mut authenticated: bool = false;

        if Method::OPTIONS == *req.method() {
            authenticated = true;
        } else {
            if req.path().starts_with("/api/login") {
                authenticated = true;
            }
        };

        let auth_key: String;
        if req.headers().contains_key("Authorization") {
            auth_key = "Authorization".to_string();
        } else if req.headers().contains_key("Authorization") {
            auth_key = "authorization".to_string();
        } else {
            auth_key = "AUTHORIZATION".to_string();
        }

        if let Some(auth_header) = req.headers().get(auth_key) {
            println!("{:?}", auth_header);
            if let Ok(auth_value) = auth_header.to_str() {
                println!("{:?}", auth_value);
                if auth_value.starts_with("bearer") || auth_value.starts_with("Bearer") {
                    let token = auth_value[6..auth_value.len()].trim();
                    println!("{:?}", token);
                    let secret = env::var("SECRET").unwrap().into_bytes();
                    if let Ok(token_contents) = decode::<Claims>(
                        &token.to_string(),
                        &DecodingKey::from_secret(&secret),
                        &Validation::new(Algorithm::HS256),
                    ) {
                        println!("{:?}", token_contents);
                        authenticated = true
                    }
                }
            }
        }

        if authenticated {
            let fut = self.service.call(req);
            Box::pin(async move {
                let res = fut.await;
                res
            })
        } else {
            return Box::pin(async move { Err(ErrorUnauthorized("not authorized"))? });
        }
    }
}
