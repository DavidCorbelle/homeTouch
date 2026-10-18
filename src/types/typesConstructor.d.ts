type BotoneraProps = {
    setFunction:Function;
    category_list:Array<MenuCategory>
}
type MenuAction = {
    action_id: number,
    category_id: number,
    action_name: string,
    action_data: Array<MenuActionItem>,
    img_base64: string | undefined,
}

type MenuActionItem = {
    command: string,
    params: Array<string>,
    env_params: Array<EnvParamsCommand>,
    [key: string]: any,
}


type EnvParamsCommand = {
    key: string,
    value: string,
}

type MenuCategory = {
    category_id: number,
    category_name: string,
}

type BodyStyles ={
    key:string,
    value: string,
}

type AppCustomConfig = {
    background_image: String,
}

type SoundAction = {
    sound_id: number,
    sound_name: string,
    sound_route: string,
    sound_volume: number,
    [key: string]: any,
}