use actix_web::web::Json;
use actix_web::{post, HttpResponse};
use serde::{Deserialize, Serialize};

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

// list all assets `/assets`
//#[get("/assets")]
//pub async fn list() -> HttpResponse {
//// TODO
//let assets = {};
//HttpResponse::Ok()
//.content_type("application/json")
//.json(assets)
//}

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
