use mongodb::bson::oid::ObjectId;
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

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub oid: String,
    pub admin: bool,
    pub write: bool,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct UserEmail {
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserCreds {
    pub _id: ObjectId,
    pub email: String,
    pub password_hash: String,
    pub admin: bool,
    pub write: bool,
}

#[derive(Serialize, Deserialize)]
pub struct LoginData {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub _id: ObjectId,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: String,
    pub security_token: SecurityToken,
}

#[derive(Serialize, Deserialize)]
pub struct SecurityToken {
    pub token: String,
    pub expires: u64,
}

#[derive(Serialize, Deserialize)]
pub struct UserToken {
    pub security_token: SecurityToken,
}

#[derive(Serialize, Deserialize)]
pub struct UserOid {
    pub _id: ObjectId,
}

#[derive(Serialize, Deserialize)]
pub struct RequestFormData {
    pub oid: String,
    pub token: String,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordSetRequest {
    pub oid: String,
    pub token: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct PasswordInsert {
    pub password_hash: String,
    pub status: String,
}

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

#[derive(Serialize, Deserialize)]
pub struct UserPermissions {
    pub admin: bool,
    pub write: bool,
}

#[derive(Serialize, Deserialize)]
pub struct AdminInsert {
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub admin: bool,
    pub write: bool,
    pub status: String,
    pub password_hash: String,
}

#[derive(Serialize, Deserialize)]
pub struct Admins {
    pub admin: bool,
}
