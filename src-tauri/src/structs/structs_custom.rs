use serde::{Deserialize, Serialize};
use sqlx::Decode;

#[derive(Serialize, Deserialize)]
pub struct MenuCategory {
    pub category_id: u32,
    pub category_name: String,
}
#[derive(Serialize, Deserialize)]
pub struct MenuAction {
    pub action_id: u32,
    pub category_id: u32,
    pub action_name: String,
    pub action_data:Vec<MenuActionItem>,
    pub img_base64: Option<String>,
}

#[derive(Serialize, Deserialize, Decode)]
pub struct MenuActionItem {
    pub command: String,
    pub params: Vec<String>,
    pub env_params: Vec<EnvParamsCommand>,
}

#[derive(Serialize, Deserialize)]
pub struct EnvParamsCommand {
    pub key: String,
    pub value: String,
}
