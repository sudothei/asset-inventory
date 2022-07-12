use actix_web::web::{Json, Path};
use actix_web::{delete, get, patch, post, put, HttpResponse};
use serde::{Deserialize, Serialize};

pub struct Response<T> {
    pub results: Vec<T>,
}

pub type Assets = Response<Asset>;

#[derive(Serialize)]
pub struct Asset {
    pub id: i32,
    pub name: String,
    pub assetno: String,
    pub vendor: String,
    pub category: String,
    pub subcategory: Option<String>,
    pub count: i32,
    pub location: String,
    pub sublocation: Option<String>,
    pub description: Option<String>,
    pub serialno: Option<String>,
    pub notes: Option<String>,
}

#[derive(Deserialize)]
pub struct AssetRequest {
    pub name: String,
    pub assetno: String,
    pub vendor: String,
    pub category: String,
    pub subcategory: Option<String>,
    pub count: i32,
    pub location: String,
    pub sublocation: Option<String>,
    pub description: Option<String>,
    pub serialno: Option<String>,
    pub notes: Option<String>,
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
        .json(())
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
