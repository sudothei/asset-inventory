use actix_web::web::{Json, Path};
use actix_web::{delete, get, patch, post, put, HttpResponse};
use serde::{Deserialize, Serialize};

pub struct Response<T> {
    pub results: Vec<T>,
}

pub type Assets = Response<Asset>;

#[derive(Serialize)]
pub struct Asset {
    pub message: String,
}

impl Asset {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}

#[derive(Deserialize)]
pub struct AssetRequest {
    pub message: Option<String>,
}

impl AssetRequest {
    pub fn to_asset(&self) -> Option<Asset> {
        match &self.message {
            Some(message) => Some(Asset::new(message.to_string())),
            None => None,
        }
    }
}

/// list all assets `/assets`
#[get("/assets")]
pub async fn list() -> HttpResponse {
    // TODO
    let assets = { "assets": vec![] };
    HttpResponse::Ok()
        .content_type("application/json")
        .json(assets)
}

/// create a asset `/assets`
#[post("/assets")]
pub async fn create(asset_req: Json<AssetRequest>) -> HttpResponse {
    HttpResponse::Created()
        .content_type("application/json")
        .json(asset_req.to_asset())
}

/// find a asset by its id `/assets/{id}`
#[get("/assets/{id}")]
pub async fn get(path: Path<(String,)>) -> HttpResponse {
    // TODO find asset a asset by ID and return it
    HttpResponse::Ok().content_type("application/json").json({})
}

/// delete a asset by its id `/assets/{id}`
#[delete("/assets/{id}")]
pub async fn delete(path: Path<(String,)>) -> HttpResponse {
    // TODO delete asset by ID
    HttpResponse::NoContent()
        .content_type("application/json")
        .await
        .unwrap()
}
