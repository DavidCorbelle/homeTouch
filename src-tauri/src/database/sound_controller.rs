use crate::database::database_controller::get_connection;
use crate::structs::structs_custom::DBSoundItem;
use sqlx::sqlite::SqliteQueryResult;
use sqlx::{Row, SqlitePool};
use std::fs::File;
use std::io::BufReader;

pub async fn sounds_get_all() -> Result<Vec<DBSoundItem>, sqlx::Error> {
    let con: SqlitePool = get_connection().await.unwrap();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> =
        sqlx::query("SELECT * FROM sound_board")
            .fetch_all(&con)
            .await;
    let mut return_items: Vec<DBSoundItem> = vec![];
    if select_result.is_ok() {
        let return_rows = select_result?;
        for row in return_rows {
            return_items.push(DBSoundItem {
                sound_id: row.get("sound_id"),
                sound_volume: row.get("sound_volume"),
                sound_name: row.get("sound_name"),
                sound_route: row.get("sound_route"),
            })
        }
        Ok(return_items)
    } else {
        Err(sqlx::Error::RowNotFound)
    }
}
pub async fn sound_upsert(sound_string: String) -> Result<String, sqlx::Error> {
    let sound_data: DBSoundItem = serde_json::from_str(&sound_string).unwrap();
    let con: SqlitePool = get_connection().await.unwrap();
    let _result: SqliteQueryResult = sqlx::query(
        "INSERT INTO sound_board (sound_route  , sound_volume , sound_name) VALUES ($1, $2, $3) ON CONFLICT(sound_name) DO UPDATE SET sound_volume = excluded.sound_volume, sound_route=excluded.sound_route;",
    )
        .bind(sound_data.sound_route)
        .bind(sound_data.sound_volume)
        .bind(sound_data.sound_name)
        .execute(&con)
        .await
        .unwrap();
    Ok(String::from("Sonido actualizado"))
}
pub async fn sound_delete(sound_id: u32) -> Result<String, sqlx::Error> {
    let con: SqlitePool = get_connection().await.unwrap();
    let _result: Result<SqliteQueryResult, sqlx::Error> =
        sqlx::query("DELETE FROM sound_board WHERE sound_id=$1")
            .bind(sound_id)
            .execute(&con)
            .await;
    if _result.is_ok() {
        Ok(String::from("Sonido eliminado"))
    } else {
        Err(sqlx::Error::RowNotFound)
    }
}
pub async fn sound_execute(sound_id: u32) -> Result<String, sqlx::Error> {
    let con: SqlitePool = get_connection().await.unwrap();
    let select_result: Result<Vec<sqlx::sqlite::SqliteRow>, sqlx::Error> =
        sqlx::query("SELECT * FROM sound_board WHERE sound_id = $1")
            .bind(sound_id)
            .fetch_all(&con)
            .await;
    if select_result.is_ok() {
        let return_row_tmp = select_result?;
        let return_row = return_row_tmp.get(0).unwrap();
        let sound_dir: String = return_row.get("sound_route");
        let sink_handle =
            rodio::DeviceSinkBuilder::open_default_sink().expect("open default audio stream");
        let file_tmp = File::open(sound_dir)?;
        let file = BufReader::new(file_tmp);
        let player = rodio::play(&sink_handle.mixer(), file).unwrap();
        let volume_number: u32 = return_row.get("sound_volume");
        let volume_float : f32 = volume_number as f32;
        player.set_volume(volume_float / 100.0);
        player.play();
        player.sleep_until_end();
        Ok(String::from("Sound ended"))
    } else {
        Err(sqlx::Error::RowNotFound)
    }
}
