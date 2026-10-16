use std::collections::HashMap;
use serde::Serialize;
use sqlx::{Row, SqlitePool};
use crate::database::database_controller::get_connection;
use crate::structs::structs_custom::AppCustomConfig;

pub async fn get_custom_config() -> Result<AppCustomConfig, ()> {
    let con: SqlitePool = get_connection().await.unwrap();
    let mut configMap = HashMap::new();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> = sqlx::query("SELECT * FROM config").fetch_all(&con).await;
    if(select_result.is_ok()){
        let result_unwrap = select_result.unwrap();
        for row in result_unwrap{
            let key:String = row.get("key");
            let value:String = row.get("value");
            configMap.entry(key).insert_entry(value);
        }
        let config_string = serde_json::to_string(&configMap).unwrap();
        let config: AppCustomConfig = serde_json::from_str(&config_string).unwrap();
        Ok(config)
    }else{
        Err(())
    }
}

pub async fn save_config_bd(config:HashMap<String,String>) -> Result<(), sqlx::Error>{
    let con: SqlitePool = get_connection().await.unwrap();
    for (key,value) in config{
        let result = sqlx::query("INSERT INTO config (key, value) VALUES($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key).bind(value).execute(&con).await;
        if  !result.is_ok() {
            println!("Error: {:?}", result.unwrap_err());
        }
    }
    Ok(())
}
