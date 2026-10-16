import React from "react";
import {convertToBase64} from "../../functions/utils_functions.tsx";
import {ESTADOS_MENU} from "../../functions/consts.tsx";
import {invoke} from "@tauri-apps/api/core";

const ConfigMenu = ({returnFunction}:{returnFunction:Function})=>{

    async function submit (e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        let formData = new FormData(e.target);
        let img =  formData.get("background-image") as File;
        let base64Img = undefined;
        if(img!=undefined && img.size>0){
            base64Img = await convertToBase64(img);
        }
        let configUpdate = {background_image:base64Img};
        invoke('save_config', {configUpdate});
        returnFunction(ESTADOS_MENU.MENU_UTILS)
    }
    return(<><form onSubmit={(e)=>(submit(e))}>
        <label> Background:
            <input type={"file"} accept={"image/*"} name={"background-image"}/>
        </label>
        <button>Save Config</button>
    </form></>)
}

export default ConfigMenu;