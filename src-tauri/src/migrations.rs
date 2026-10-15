use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    let migrations: Vec<Migration> = vec![
        Migration{
            version:1,
            description:"create category_commands",
            sql:"CREATE TABLE category_commands (category_id INTEGER, category_name TEXT, PRIMARY KEY(category_id AUTOINCREMENT))  ",
            kind:MigrationKind::Up
        },
        Migration{
            version:2,
            description:"create action_commands",
            sql:"CREATE TABLE action_commands (action_id INTEGER , category_id INTEGER , action_name TEXT , command TEXT , params TEXT , env_params TEXT , img_base64 TEXT, PRIMARY KEY(action_id AUTOINCREMENT)) ",
            kind:MigrationKind::Up
        },
        Migration{
            version:3,
            description:"create multi_action_commands",
            sql:"ALTER TABLE action_commands ADD action_data TEXT;UPDATE action_commands SET action_data = CONCAT('[{ \"command\":\"', command,'\", \"params\":', params, ', \"env_params\":', env_params, '}]' ) WHERE action_id != 0;ALTER TABLE action_commands DROP command;ALTER TABLE action_commands DROP params;ALTER TABLE action_commands DROP env_params;",
            kind:MigrationKind::Up

        }
	
    ];
    return migrations;
}
