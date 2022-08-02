use crate::error::bad_input;
use crate::helpers::get_token;
use crate::models::{Asset, AssetRequest};
use actix_web::web::Json;
use actix_web::{delete, get, post, put, web, HttpRequest, HttpResponse, Responder};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use std::sync::*;
use tokio_stream::StreamExt;

/// list all assets `/api/assets`
#[get("/api/assets")]
pub async fn list(data: web::Data<Mutex<Database>>, req: HttpRequest) -> impl Responder {
    let jwt = get_token(req);
    match jwt {
        None => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Unauthorized")
        }
        Some(_rs) => {}
    }
    let db = data.lock().unwrap();
    let asset_collection = db.collection::<Asset>("assets");
    let cursor = asset_collection.find(None, None).await.unwrap();

    let results: Vec<Result<Asset, mongodb::error::Error>> = cursor.collect().await;
    let assets: Vec<Asset> = results.into_iter().map(|d| d.unwrap()).collect();

    HttpResponse::Ok()
        .content_type("application/json")
        .json(assets)
}

/// create an asset `/api/assets`
#[post("/api/assets")]
pub async fn create(
    data: web::Data<Mutex<Database>>,
    asset_req: Json<AssetRequest>,
    req: HttpRequest,
) -> impl Responder {
    let jwt = get_token(req);
    match jwt {
        None => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Unauthorized")
        }
        Some(rs) => {
            if !rs.write {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }

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

/// update an asset `/api/assets/{id}`
#[put("/api/assets/{id}")]
pub async fn update(
    id: web::Path<String>,
    data: web::Data<Mutex<Database>>,
    asset: Json<Asset>,
    req: HttpRequest,
) -> impl Responder {
    let jwt = get_token(req);
    match jwt {
        None => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Unauthorized")
        }
        Some(rs) => {
            if !rs.write {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
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

/// delete a asset `/api/assets/{id}`
#[delete("/api/assets/{id}")]
pub async fn delete(
    id: web::Path<String>,
    data: web::Data<Mutex<Database>>,
    req: HttpRequest,
) -> impl Responder {
    let jwt = get_token(req);
    match jwt {
        None => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Unauthorized")
        }
        Some(rs) => {
            if !rs.write {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
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
