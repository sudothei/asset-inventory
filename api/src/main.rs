use actix_cors::Cors;
use actix_web::{http, web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};
use std::env;
use std::sync::*;

mod asset;
mod auth;
mod error;
mod helpers;
mod models;
mod password;
mod user;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // environment variables
    let database_username: String =
        env::var("DATABASE_USERNAME").expect("DATABASE_USERNAME must be set");
    let database_password: String =
        env::var("DATABASE_PASSWORD").expect("DATABASE_PASSWORD must be set");
    let database_hostname: String =
        env::var("DATABASE_HOSTNAME").expect("DATABASE_HOSTNAME must be set");
    let database_port: String = env::var("DATABASE_PORT").expect("DATABASE_PORT must be set");
    let database_name: String = env::var("DATABASE_NAME").expect("DATABASE_NAME must be set");

    // database config
    let mut client_options = ClientOptions::parse(format!(
        "mongodb://{}:{}@{}:{}",
        database_username, database_password, database_hostname, database_port
    ))
    .await
    .unwrap();
    client_options.app_name = Some(database_name.to_string());
    let db = web::Data::new(Mutex::new(
        Client::with_options(client_options)
            .unwrap()
            .database("inventoryAssetDB"),
    ));

    // create initial admin if user collection has none
    helpers::create_initial_admin(db.clone()).await;

    // uses move to avoid closure problems with db
    HttpServer::new(move || {
        // uses cors to allow api requests from any origin
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);
        App::new()
            .app_data(db.clone())
            .wrap(cors)
            .service(auth::login)
            .service(asset::create)
            .service(asset::list)
            .service(asset::update)
            .service(asset::delete)
            .service(user::create)
            .service(user::list)
            .service(user::update)
            .service(user::delete)
            .service(password::request_form)
            .service(password::request_email)
            .service(password::set_password)
    })
    .bind(format!("0.0.0.0:{}", 80))?
    .run()
    .await
}
