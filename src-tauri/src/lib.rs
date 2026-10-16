use std::{env, process::Command};
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};
mod migrations;
mod structs;
use structs::structs_custom::{EnvParamsCommand, MenuCategory};

mod database;
use crate::database::action_controller::{delete_action_bd, get_all_actions, invoke_action_bd, save_action};
use crate::database::category_controller::{delete_category_bd, get_all_category, save_category};
use crate::database::config_controller::{get_custom_config, save_config_bd};
use crate::structs::structs_custom::{AppCustomConfig, MenuAction};

#[tauri::command]
fn start_obs() {
    let mut output = Command::new("obs");
    let array_env: [EnvParamsCommand; 2] = [
        EnvParamsCommand {
            key: String::from("RUST_BACKTRACE"),
            value: String::from("1"),
        },
        EnvParamsCommand {
            key: String::from("QT_QPA_PLATFORM"),
            value: String::from("xcb"),
        },
    ];
    for env in array_env.iter() {
        output.env(env.key.clone(), env.value.clone());
    }
    let _end = output.spawn();
}

#[tauri::command]
async fn return_category_list() -> Result<Vec<MenuCategory>, ()> {
    let category_list: Result<Vec<MenuCategory>, sqlx::Error> = get_all_category().await;
    if category_list.is_ok() {
        Ok(category_list.unwrap())
    } else {
        Err(())
    }
}

#[tauri::command]
async fn return_action_list() -> Result<Vec<MenuAction>, ()> {
    let action_list: Result<Vec<MenuAction>, sqlx::Error> = get_all_actions().await;
    if action_list.is_ok() {
        Ok(action_list.unwrap())
    } else {
        Err(())
    }
}

#[tauri::command]
async fn save_action_tauri(
    action_string: String,
    id_action: u32,
    app: AppHandle,
) -> Result<String, ()> {
    let _output = save_action(action_string, id_action).await;
    let _emit = app.emit("app-updated", "STREAMER_TOKEN_TYPE");
    Ok(String::from("command saved"))
}

#[tauri::command]
async fn save_category_tauri(category_string: String, app: AppHandle) -> Result<String, ()> {
    let _output = save_category(category_string).await;
    let _emit = app.emit("app-updated", "STREAMER_TOKEN_TYPE");
    Ok(String::from("command saved"))
}
#[tauri::command]
async fn invoke_action(action_id: u32) {
    let _output = invoke_action_bd(action_id).await;
}

#[tauri::command]
async fn delete_action(action_id: u32, app:AppHandle) -> Result<String, ()> {
    let _output = delete_action_bd(action_id).await;
    let _emit = app.emit("app-updated", "STREAMER_TOKEN_TYPE");
    Ok(String::from("command deleted"))
}

#[tauri::command]
async fn delete_category(category_id: u32, app:AppHandle) -> Result<String, ()> {
    let _output = delete_category_bd(category_id).await;
    let _emit = app.emit("app-updated", "STREAMER_TOKEN_TYPE");
    Ok(String::from("command deleted"))
}

#[tauri::command]
async fn get_config() -> Result<AppCustomConfig, ()>{
    let output = get_custom_config().await;
    if(output.is_ok()){
        Ok(output.unwrap())
    }else {
        Err(())
    }

}

#[tauri::command]
async fn save_config(config_update:HashMap<String,String>, app:AppHandle) -> Result<String, ()>{
    let _output = save_config_bd(config_update).await;
    if(_output.is_ok()){
        let _emit = app.emit("app-updated", "STREAMER_TOKEN_TYPE");
        Ok(String::from("config saved"))
    }else {
        Err(())
    }

}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations: Vec<tauri_plugin_sql::Migration> = migrations::get_migrations();
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:database.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            start_obs,
            return_category_list,
            save_category_tauri,
            return_action_list,
            save_action_tauri,
            invoke_action,
            delete_action,
            delete_category,
            get_config,
            save_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
