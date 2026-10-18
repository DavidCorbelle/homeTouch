import {invoke} from "@tauri-apps/api/core";

const SoundsActions = ({sounds}:{sounds:Array<SoundAction>}) =>  {

    function executeSound (soundId:number){
     invoke('execute_sound',{soundId});
    }

    return(<>
        <div  style={{marginTop:"24px"}} className={"formNewCommand"}>
            <div>
                {sounds?
                    sounds.map((s)=>{
                        return(<button className="textButton buttonBotonera"  onClick={()=>{executeSound(s.sound_id)}} > {s.sound_name}</button>)
                    })
                    :
                    null
                }
            </div>
        </div>
    </>)

}
export {SoundsActions}
