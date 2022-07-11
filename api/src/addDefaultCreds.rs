extern crate bcrypt;

pub fn addDefaultCreds() {
    match bcrypt::hash("admin", 14) {
        Ok(hashed) => println!("{}", hashed),
        Err(e) => println!("{:?}", e),
    };
}
