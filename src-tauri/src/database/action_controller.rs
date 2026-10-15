use crate::database::database_controller::get_connection;
use crate::structs::structs_custom::{MenuAction, MenuActionItem};
use sqlx::sqlite::SqliteQueryResult;
use sqlx::{Row, SqlitePool};
use std::process::Command;

pub async fn get_all_actions() -> Result<Vec<MenuAction>, sqlx::Error> {
    let con: SqlitePool = get_connection().await.unwrap();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> =
        sqlx::query("SELECT * FROM action_commands")
            .fetch_all(&con)
            .await;
    let mut result: Vec<MenuAction> = vec![];
    if select_result.is_ok() {
        let result_data = select_result?;
        for i in result_data {

            let action_data_string: String= i.get("action_data");
            let action_data_parsed:Vec<MenuActionItem> = serde_json::from_str(&action_data_string).unwrap();
            result.push(MenuAction {
                action_id: i.get("action_id"),
                category_id: i.get("category_id"),
                action_name: i.get("action_name"),
                action_data: action_data_parsed,
                img_base64: i.get("img_base64"),
            })
        }
    }
    Ok(result)
}

pub async fn save_action(action_string: String, id_action:u32) -> Result<String, ()> {
    let con: SqlitePool = get_connection().await?;
    let new_action: MenuAction = serde_json::from_str(action_string.as_str()).unwrap();
    let action_data_string = serde_json::to_string(&new_action.action_data).unwrap();
    if id_action==0 {
        let insert_result:Result<SqliteQueryResult, sqlx::Error> = sqlx::query(
            "INSERT INTO action_commands (category_id , action_name , action_data , img_base64) VALUES ($1,$2,$3,$4)",
        )
            .bind(new_action.category_id)
            .bind(new_action.action_name)
            .bind(action_data_string)
            .bind(new_action.img_base64)
            .execute(&con)
            .await;
        if insert_result.is_ok() {
            Ok(String::from("Command saved"))
        } else {
            Err(())
        }
    }else{

        if new_action.img_base64.is_some() {
            let update_result:Result<SqliteQueryResult, sqlx::Error>= sqlx::query("UPDATE action_commands SET category_id = $2, action_name = $3, action_data = $4, img_base64 = $5 WHERE action_id = $1")
                .bind(id_action)
                .bind(new_action.category_id)
                .bind(new_action.action_name)
                .bind(action_data_string)
                .bind(new_action.img_base64)
                .execute(&con)
                .await;
            if update_result.is_ok() {
                Ok(String::from("Command saved"))
            } else {
                Err(())
            }
        }else{
            let update_result:Result<SqliteQueryResult, sqlx::Error>= sqlx::query("UPDATE action_commands SET category_id = $2, action_name = $3, action_data = $4 WHERE action_id = $1")
                .bind(id_action)
                .bind(new_action.category_id)
                .bind(new_action.action_name)
                .bind(action_data_string)
                .execute(&con)
                .await;
            if update_result.is_ok() {
                Ok(String::from("Command saved"))
            } else {
                Err(())
            }
        }


    }
}

pub async fn delete_action_bd(action_id:u32){
    let con: SqlitePool = get_connection().await.unwrap();
    let _result: SqliteQueryResult = sqlx::query(
        "DELETE FROM action_commands WHERE action_id=$1",
    )
        .bind(action_id)
        .execute(&con)
        .await
        .unwrap();
}


pub async fn invoke_action_bd(action_id: u32) {
    let con: SqlitePool = get_connection().await.unwrap();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> =
        sqlx::query("SELECT * FROM action_commands WHERE action_id = $1")
            .bind(action_id)
            .fetch_all(&con)
            .await;
    if select_result.is_ok() {
        let result_data = select_result.unwrap();
        if result_data.len() == 1 {
            let action_bd = result_data.get(0).unwrap();
            let command_actions: Vec<MenuActionItem> = serde_json::from_str( action_bd.get("action_data")).unwrap();
            for i in command_actions {
                let mut action_spawn: Command = Command::new(&i.command);
                for arg in i.params {
                    action_spawn.arg(arg);
                }
                for env_param in i.env_params {
                    if env_param.key.len()>0 && env_param.value.len()>0 {
                        action_spawn.env(env_param.key, env_param.value);
                    }
                }
                let _ = action_spawn.spawn();
            }

        }
    }
}
