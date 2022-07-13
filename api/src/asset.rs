use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse, Responder};
use mongodb::{bson::doc, Database};
use serde::{Deserialize, Serialize};
use std::sync::*;
use tokio_stream::StreamExt;

#[derive(Deserialize, Serialize)]
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

#[derive(Serialize, Deserialize)]
pub struct Asset {
    pub _id: i32,
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
pub async fn list(data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let asset_collection = db.collection::<Asset>("assets");
    let cursor = asset_collection.find(None, None).await.unwrap();

    let results: Vec<Result<Asset, mongodb::error::Error>> = cursor.collect().await;
    let assets: Vec<Asset> = results.into_iter().map(|d| d.unwrap()).collect();

    HttpResponse::Ok()
        .content_type("application/json")
        .json(assets)
}

/// create a asset `/assets`
#[post("/assets")]
pub async fn create(asset_req: Json<AssetRequest>) -> HttpResponse {
    HttpResponse::Created()
        .content_type("application/json")
        .json(asset_req)
}

// find a asset by its id `/assets/{id}`
//#[get("/assets/{id}")]
//pub async fn get(path: Path<(String,)>) -> HttpResponse {
//TODO find asset a asset by ID and return it
//HttpResponse::Ok().content_type("application/json").json({})
//}

// delete a asset by its id `/assets/{id}`
//#[delete("/assets/{id}")]
//pub async fn delete(path: Path<(String,)>) -> HttpResponse {
//TODO delete asset by ID
//HttpResponse::NoContent()
//.content_type("application/json")
//.await
//.unwrap()
//}
