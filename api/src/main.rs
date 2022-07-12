use actix_cors::Cors;
use actix_web::{http, App, HttpServer};
use std::env;

mod asset;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let hostname: String = env::var("SERVER_HOSTNAME").expect("SERVER_HOSTNAME must be set");
        let cors = Cors::default()
            .allowed_origin(format!("https://{}/", hostname).as_str())
            .allow_any_method()
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new().wrap(cors).service(asset::create)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
