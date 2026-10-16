import {ESTADOS_MENU} from "../../functions/consts.tsx";
import {invoke} from "@tauri-apps/api/core";

const ListActions = ({allActions, setCurrentAction, setScreen}:{allActions:Array<MenuAction>, setCurrentAction:Function, setScreen:Function}) =>  {

    return(<div className={"actionList"}>
        {allActions? allActions.map((action:MenuAction)=>{
            return(<><div>{action.action_name}</div>
                <button onClick={()=>{setCurrentAction(undefined),setCurrentAction(action);setScreen(ESTADOS_MENU.NEW_ACTION)}}>Edit</button>
                <button onClick={()=>{let actionId = action.action_id;invoke('delete_action', {actionId} )}}>Delete</button></>)
        }) : null }
        </div>)

}
export {ListActions}