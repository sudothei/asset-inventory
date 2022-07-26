use crate::helpers::bad_input;
use actix_web::web::Json;
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use serde::{Deserialize, Serialize};
use std::sync::*;
use tokio_stream::StreamExt;

#[derive(Serialize, Deserialize)]
pub struct ExistingUser {
    pub _id: ObjectId,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserAddRequest {
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
}

#[derive(Serialize, Deserialize)]
pub struct UserInsert {
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: String,
}

/// list all users `/api/users`
#[get("/api/users")]
pub async fn list(data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<ExistingUser>("users");
    let cursor = user_collection.find(None, None).await.unwrap();

    let results: Vec<Result<ExistingUser, mongodb::error::Error>> = cursor.collect().await;
    let users: Vec<ExistingUser> = results.into_iter().map(|d| d.unwrap()).collect();

    HttpResponse::Ok()
        .content_type("application/json")
        .json(users)
}

/// create a user `/api/users`
#[post("/api/users")]
pub async fn create(
    data: web::Data<Mutex<Database>>,
    user_req: Json<UserAddRequest>,
) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection("users");

    let new_user = UserInsert {
        status: "Pending".to_string(),
        firstname: user_req.firstname.to_string(),
        lastname: user_req.lastname.to_string(),
        email: user_req.email.to_string(),
        admin: user_req.admin,
        write: user_req.write,
    };

    let result = user_collection.insert_one(new_user, None).await;
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

/// delete a user `/api/users/{id}`
#[delete("/api/users/{id}")]
pub async fn delete(id: web::Path<String>, data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let user_collection = db.collection::<ExistingUser>("users");
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
    let result = user_collection.delete_one(filter, None).await;
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
