import {ESTADOS_MENU} from "../../functions/consts.tsx";
import {invoke} from "@tauri-apps/api/core";

const ListSounds = ({allSounds, setMenuSound, setScreen}:{allSounds:Array<SoundAction>, setMenuSound:Function, setScreen:Function}) =>  {

    return(<div className={"actionList"}>
        {allSounds? allSounds.map((sound:SoundAction)=>{
            return(<><div>{sound.sound_name}</div>
                <button onClick={()=>{setMenuSound(undefined),setMenuSound(sound);setScreen(ESTADOS_MENU.NEW_SOUND)}}>Edit</button>
                <button onClick={()=>{let soundId = sound.sound_id;invoke('delete_sound', {soundId} )}}>Delete</button></>)
        }) : null }
    </div>)

}
export {ListSounds}