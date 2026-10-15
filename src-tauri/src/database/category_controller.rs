use crate::database::database_controller::get_connection;
use crate::structs::structs_custom::MenuCategory;
use sqlx::sqlite::SqliteQueryResult;
use sqlx::{Row, SqlitePool};

pub async fn get_all_category() -> Result<Vec<MenuCategory>, sqlx::Error> {
    let con: SqlitePool = get_connection().await.unwrap();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> =
        sqlx::query("SELECT * FROM category_commands")
            .fetch_all(&con)
            .await;
    let mut result: Vec<MenuCategory> = vec![];
    if select_result.is_ok() {
        let result_data = select_result?;
        for i in result_data {
            result.push(MenuCategory {
                category_id: i.get("category_id"),
                category_name: i.get("category_name"),
            })
        }
    }
    Ok(result)
}

pub async fn save_category(category_string: String) -> Result<String, ()> {
    let con: SqlitePool = get_connection().await?;
    let new_category: MenuCategory = serde_json::from_str(category_string.as_str()).unwrap();
    let insert_result: Result<SqliteQueryResult, sqlx::Error> =
        sqlx::query("INSERT INTO category_commands (category_name) VALUES ($1)")
            .bind(new_category.category_name)
            .execute(&con)
            .await;
    if insert_result.is_ok() {
        Ok(String::from("Command saved"))
    } else {
        Err(())
    }
}

pub async fn delete_category_bd(category_id:u32){
    let con: SqlitePool = get_connection().await.unwrap();
    let _result: SqliteQueryResult = sqlx::query(
        "DELETE FROM category_commands WHERE category_id=$1",
    )
        .bind(category_id)
        .execute(&con)
        .await
        .unwrap();
}

