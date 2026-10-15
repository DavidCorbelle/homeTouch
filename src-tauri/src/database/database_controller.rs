use sqlx::sqlite::SqliteConnectOptions;
use sqlx::SqlitePool;
use std::str::FromStr;

const DATABASE_PATH: &str = "database.db";
fn get_config_path(file_name: &str) -> String {
    let app: tauri::Context = tauri::generate_context!();
    let identifier: String = app.config().identifier.clone();
    let mut base_dir_path: std::path::PathBuf = dirs::config_dir().unwrap();
    base_dir_path.push(identifier);
    let base_dir = base_dir_path.as_path().to_str().unwrap();
    let path: String = format!("{base_dir}/{file_name}");
    path
}

pub(crate) async fn get_connection() -> Result<SqlitePool, ()> {
    let con_options =
        SqliteConnectOptions::from_str(&format!("sqlite://{}", get_config_path(DATABASE_PATH)))
            .unwrap();
    let con: SqlitePool = SqlitePool::connect_with(con_options).await.unwrap();
    Ok(con)
}
