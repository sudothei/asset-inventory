use crate::error::bad_input;
use crate::helpers::get_token;
use crate::models::{ExistingUser, UserAddRequest, UserInsert, UserPermissions};
use actix_web::web::Json;
use actix_web::{delete, get, post, put, web, HttpRequest, HttpResponse, Responder};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};
use std::sync::*;
use tokio_stream::StreamExt;

/// list all users `/api/users`
#[get("/api/users")]
pub async fn list(data: web::Data<Mutex<Database>>, req: HttpRequest) -> impl Responder {
    let jwt = get_token(req);
    match jwt {
        None => {
            return HttpResponse::Unauthorized()
                .content_type("text")
                .body("Unauthorized")
        }
        Some(rs) => {
            if !rs.admin {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
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
            if !rs.admin {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
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
            if !rs.admin {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
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

/// update a users permissions `/api/users/{id}`
#[put("/api/users/{id}")]
pub async fn update(
    id: web::Path<String>,
    data: web::Data<Mutex<Database>>,
    user_perms: Json<UserPermissions>,
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
            if !rs.admin {
                return HttpResponse::Unauthorized()
                    .content_type("text")
                    .body("Unauthorized");
            }
        }
    }
    let db = data.lock().unwrap();
    let user_collection = db.collection::<UserPermissions>("users");
    let filter = doc! { "_id": ObjectId::parse_str(id.into_inner()).unwrap() };
    let data = doc! {"$set": bson::to_document(&user_perms).unwrap()};
    let result = user_collection.update_one(filter, data, None).await;
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
