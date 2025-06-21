/// For extracting the message from mongodb write errors
pub fn bad_input(err: mongodb::error::Error) -> String {
    let err_msg = match *err.kind {
        mongodb::error::ErrorKind::Write(err) => match err {
            mongodb::error::WriteFailure::WriteError(e) => e.message,
            _ => "Bad request".to_string(),
        },
        _ => "Bad request".to_string(),
    };
    return err_msg.to_string();
}
