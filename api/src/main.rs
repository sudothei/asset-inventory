use actix_cors::Cors;
use actix_web::{http, App, HttpServer};
use std::env;

mod asset;

pub const SERVER_HOSTNAME: String =
    env::var("SERVER_HOSTNAME").expect("$SERVER_HOSTNAME is not set");

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin(format!("https://{}/", SERVER_HOSTNAME))
            .allow_any_method()
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new()
            .service(asset::list)
            .service(asset::get)
            .service(asset::create)
            .service(asset::delete)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await;

    Ok(())
}
