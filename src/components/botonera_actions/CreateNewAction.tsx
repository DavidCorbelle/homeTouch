import React, {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {convertToBase64} from "../../functions/utils_functions.tsx";
import './botonera_actions.css';
import ItemActionCreate from "./ItemActionCreate.tsx";

async function prepare_data_command(data: FormData, action:MenuAction): Promise<MenuAction> {

    for (const pair of data.entries()) {
        let key:string = pair[0];
        if(key.startsWith("command")){
            let key_index:Array<string> = key.replace("command_", "").split("_");
            action.action_data[parseInt(key_index[0])].command = pair[1] as string;
        }else if(key.startsWith("params")){
            let key_index:Array<string> = key.replace("params_", "").split("_");
            action.action_data[parseInt(key_index[0])].params[parseInt(key_index[1])] = pair[1] as string;
        }else if(key.startsWith("env_params_key")){
            let key_index:Array<string> = key.replace("env_params_key_", "").split("_");
            console.log(key_index);
            let env_value = data.get("env_params_value_"+key_index[0]+"_"+key_index[1]) as string;
            action.action_data[parseInt(key_index[0])].env_params[parseInt(key_index[1])] = {key:pair[1] as string, value: env_value};
        }
    }
    let img =  data.get("img_base64") as File;
    let base64Img = undefined;
    if(img!=undefined && img.size>0){
        base64Img = await convertToBase64(img);
    }
    console.log(base64Img);
    let category_id:number = Number.parseInt(data.get("category_id") as string);
    return {
        action_id: 0,
        category_id: category_id,
        action_name: data.get("action_name") as string,
        action_data: action.action_data,
        img_base64: base64Img,
    };
}


const CreateNewAction = ({setStateMenu, menuCategory, currentAction, voidActionFunction}:{setStateMenu:Function, menuCategory:Array<MenuCategory>, currentAction:undefined|MenuAction, voidActionFunction:Function}): React.ReactElement => {
    const startAction = (currentAction:MenuAction|undefined):void => {
        if(currentAction!=undefined){
            console.log(currentAction);
            setAction(JSON.parse(JSON.stringify(currentAction)));
        }else{
            setAction({action_data:[], action_id:0, action_name:'', category_id:menuCategory[0].category_id , img_base64:undefined});
        }
    }
    const[action , setAction] = useState<MenuAction>();
    const[forceUpdate , setForceUpdate] = useState<boolean>(false);
    useEffect(()=>{
        startAction(currentAction);
    },[currentAction])
    async function save_action (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        let idAction = action?.action_id;
        console.log(idAction);
        const formData = new FormData(e.target);
        if(action!=undefined){
            let actionString = JSON.stringify(await prepare_data_command(formData, action));
            console.log(actionString);
            await invoke("save_action_tauri", {actionString , idAction});
            setStateMenu(menuCategory[0].category_id);
        }
        voidActionFunction(undefined);
    }
    function addParam(index:number){
        let actionTmp = action;
        actionTmp?.action_data[index].params.push("");
        setAction(actionTmp);
        setForceUpdate(!forceUpdate);
    }
    async function deleteParam(index:number, index_param:number){
        let form:HTMLFormElement = document.getElementById("formNewCommand") as HTMLFormElement;
        let formData = new FormData(form);
        if(action!=undefined){
            let actionTmp = await prepare_data_command(formData, action);;
        actionTmp?.action_data[index].params.splice(index_param, 1);
        setAction(actionTmp);
        setForceUpdate(!forceUpdate);
        }
    }

    async function deleteEnvParam(index:number, index_env_param:number){
        let form:HTMLFormElement = document.getElementById("formNewCommand") as HTMLFormElement;
        let formData = new FormData(form);
        if(action!=undefined){
            let actionTmp = await prepare_data_command(formData, action);;
        actionTmp?.action_data[index].env_params.splice(index_env_param, 1);
        setAction(actionTmp);
        setForceUpdate(!forceUpdate);
        }
    }

    async function addEnvParam(index:number){
        let form:HTMLFormElement = document.getElementById("formNewCommand") as HTMLFormElement;
        let formData = new FormData(form);
        if(action!=undefined){
            let actionTmp = await prepare_data_command(formData, action);;
        actionTmp?.action_data[index].env_params.push({key:"", value:""});
        setAction(actionTmp);
        setForceUpdate(!forceUpdate);
        }
    }
    async function addAction (){
        let form:HTMLFormElement = document.getElementById("formNewCommand") as HTMLFormElement;
        let formData = new FormData(form);
        if(action!=undefined){
            let actionTmp = await prepare_data_command(formData, action);;
        actionTmp?.action_data.push({command:"", params:[], env_params:[]});
        setAction(actionTmp);
        setForceUpdate(!forceUpdate);
        }
    }

    async function deleteAction(index:number){
        let form:HTMLFormElement = document.getElementById("formNewCommand") as HTMLFormElement;
        let formData = new FormData(form);
        if(action!=undefined){
            let actionTmp = await prepare_data_command(formData, action);;
            console.log(actionTmp?.action_data);
            actionTmp?.action_data.splice(index, 1);
            console.log(actionTmp?.action_data);
            setAction(actionTmp);
            forceUpdateFunc ()
        }

    }
    function  forceUpdateFunc (){
        setForceUpdate(!forceUpdate);
    }

    return (<><form  id={"formNewCommand"} className={"formNewCommand"} onSubmit={(e)=>{save_action(e)}}>
        <label> Categoria:
            <select defaultValue={currentAction?.category_id} name={"category_id"}>
                {menuCategory? menuCategory.map((c)=>{return(<option value={c.category_id}>{c.category_name}</option>)}):null}
            </select>
        </label>
        <label>Action Name:
            <input type={"text"} name={"action_name"} defaultValue={currentAction?.action_name}/>
        </label>
        <label> Imagen:
            <input type={"file"} accept={"image/*"} name={"img_base64"}/>
        </label>
        {action ? action?.action_data.map((action_item, indexAction)=>{
            return(<ItemActionCreate forceUpdate={forceUpdateFunc} deleteSelf={deleteAction} deleteParam={deleteParam}  deleteEnvParam={deleteEnvParam} addEnvParam={addEnvParam} addParam={addParam} index={indexAction} action_item={action_item}></ItemActionCreate>)
        }):null}
        <button type={"button"} onClick={()=>{addAction()}}>Add action</button>
        <button type="submit">Add</button>
    </form>
    </>);
}

export {CreateNewAction};