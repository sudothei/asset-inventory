use crate::helpers::bad_input;
use actix_web::web::Json;
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
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
    pub _id: ObjectId,
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

/// create an asset `/assets`
#[post("/assets")]
pub async fn create(
    data: web::Data<Mutex<Database>>,
    asset_req: Json<AssetRequest>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let asset_collection = db.collection("assets");
    let result = asset_collection.insert_one(asset_req, None).await;
    match result {
        Ok(rs) => {
            let new_id = rs.inserted_id.as_object_id();
            HttpResponse::Ok()
                .content_type("application/json")
                .json(new_id)
        }
        Err(err) => {
            let mongo_err = bad_input(err);
            HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err)
        }
    }
}

/// update an asset `/assets/{id}`
#[put("/assets/{id}")]
pub async fn update(
    id: web::Path<String>,
    data: web::Data<Mutex<Database>>,
    asset: Json<Asset>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let asset_collection = db.collection::<Asset>("assets");
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
    let data = doc! {"$set": bson::to_document(&asset).unwrap()};
    let result = asset_collection.update_one(filter, data, None).await;
    match result {
        Ok(rs) => HttpResponse::Ok().content_type("application/json").json(rs),
        Err(err) => {
            let mongo_err = bad_input(err);
            HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err)
        }
    }
}

/// delete a asset `/assets/{id}`
#[delete("/assets/{id}")]
pub async fn delete(id: web::Path<String>, data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let asset_collection = db.collection::<Asset>("assets");
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
    let result = asset_collection.delete_one(filter, None).await;
    match result {
        Ok(rs) => HttpResponse::Ok().content_type("application/json").json(rs),
        Err(err) => {
            let mongo_err = bad_input(err);
            HttpResponse::UnprocessableEntity()
                .content_type("text")
                .body(mongo_err)
        }
    }
}
