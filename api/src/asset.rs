use actix_web::web::{Json, Path};
use actix_web::{delete, get, patch, post, put, HttpResponse};
use serde::{Deserialize, Serialize};

pub const APPLICATION_JSON: &str = "application/json";

pub struct Response<T> {
    pub results: Vec<T>,
}

pub type Assets = Response<Asset>;

pub struct Asset {
    pub message: String,
}

impl Asset {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}

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

/// list 50 last assets `/assets`
#[get("/assets")]
pub async fn list() -> HttpResponse {
    // TODO find the last 50 assets and return them

    let assets = Assets { results: vec![] };

    HttpResponse::Ok()
        .content_type(APPLICATION_JSON)
        .json(assets)
}

/// create a asset `/assets`
#[post("/assets")]
pub async fn create(asset_req: Json<AssetRequest>) -> HttpResponse {
    HttpResponse::Created()
        .content_type(APPLICATION_JSON)
        .json(asset_req.to_asset())
}

/// find a asset by its id `/assets/{id}`
#[get("/assets/{id}")]
pub async fn get(path: Path<(String,)>) -> HttpResponse {
    // TODO find asset a asset by ID and return it
    let found_asset: Option<Asset> = None;

    match found_asset {
        Some(asset) => HttpResponse::Ok()
            .content_type(APPLICATION_JSON)
            .json(asset),
        None => HttpResponse::NoContent()
            .content_type(APPLICATION_JSON)
            .await
            .unwrap(),
    }
}

/// delete a asset by its id `/assets/{id}`
#[delete("/assets/{id}")]
pub async fn delete(path: Path<(String,)>) -> HttpResponse {
    // TODO delete asset by ID
    // in any case return status 204

    HttpResponse::NoContent()
        .content_type(APPLICATION_JSON)
        .await
        .unwrap()
}