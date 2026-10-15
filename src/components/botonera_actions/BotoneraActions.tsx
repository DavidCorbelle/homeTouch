import React from "react";
import {invoke} from "@tauri-apps/api/core";

const BotoneraActions = ({actions}:{actions:Array<MenuAction>} ): React.ReactElement => {
    function invokeCommand(actionId: number) {
        invoke('invoke_action',{actionId} )
    }

    return (<>
        {actions ?  actions.map((a)=>{

           return (<button className="textButton buttonBotonera" onClick={() => invokeCommand(a.action_id)}>{a.img_base64? <img  className={"botoneraButtonImage"} src={a.img_base64}></img> :<span>{a.action_name}</span>}</button>)
        }):null}
    </>)
}

export { BotoneraActions };