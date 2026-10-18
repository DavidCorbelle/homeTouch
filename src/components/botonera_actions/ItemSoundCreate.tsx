import {useEffect, useState} from "react";
import { open } from '@tauri-apps/plugin-dialog';
import {invoke} from "@tauri-apps/api/core";
import {ESTADOS_MENU} from "../../functions/consts.tsx";

const ItemSoundCreate = ({menuSound, setScreen}:{menuSound: SoundAction|undefined, setScreen:Function}) =>
{
    const[forceUpdate , setForceUpdate] = useState<boolean>(false);
    const startAction = (menuSound:SoundAction|undefined):void => {
        if(menuSound!=undefined){
        setSound(JSON.parse(JSON.stringify(menuSound)));
        }else{
        setSound({sound_id:0, sound_name:'', sound_route:'', sound_volume:100});
        }
    }
    const[sound , setSound] = useState<SoundAction>();
    useEffect(()=>{
        startAction(menuSound);
    },[menuSound])

    function saveSound(){
        let soundString = JSON.stringify(sound);
        console.log(soundString);
        invoke("save_sound", {soundString}).then(()=>{
            setScreen(ESTADOS_MENU.MENU_SONIDOS);
        });
    }
    function updateField(nameField:string, value:string|number){
        let valueTmp = sound;
        if(valueTmp!=undefined){
            valueTmp[nameField] = value;
            setSound(valueTmp);
            setForceUpdate(!forceUpdate);
        }


    }
    async function searchSound() {
        let value = await open() as string;
        let valueTmp = sound;
        if(valueTmp!=undefined){
            valueTmp.sound_route = value;
            setSound(valueTmp);
            setForceUpdate(!forceUpdate);
        }

    }

    return (<><div>
        <input type={"text"} value={sound?.sound_name} onChange={(e)=>{updateField("sound_name",e.target.value)}}/>
        <input type={"number"} value={sound?.sound_volume} onChange={(e)=>{updateField("sound_volume",e.target.value)}}/>
        <input name="sound_dir" id="command_form_sound_dir" type="text" defaultValue={sound != undefined ? sound.sound_route as string : ""}></input>
        {/*Revisar como conseguir la ruta del archivo*/}
        <button type="button" onClick={() => searchSound()}>Elegir Ruta</button>

        <button onClick={()=>saveSound()}>Guardar Sonido</button>

    </div></>);
}
export default ItemSoundCreate;