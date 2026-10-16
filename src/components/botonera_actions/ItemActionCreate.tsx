const ItemActionCreate = ({forceUpdate, deleteSelf, deleteEnvParam, deleteParam, addEnvParam, addParam, index, action_item}:{forceUpdate:Function, deleteSelf:Function, deleteEnvParam:Function, deleteParam:Function, addEnvParam:Function, addParam:Function, index:number, action_item:MenuActionItem})=>{

    function setDataAction(action_command:string, key:string, index:number|undefined = undefined, key_value:string|undefined = undefined){
        if(index!=undefined){
            if(key_value!=undefined){
                action_item[key][index][key_value] = action_command;
            }else{
                action_item[key][index] = action_command;
            }
        }else{
            action_item[key] = action_command;
        }
        forceUpdate()
    }

    return(<div id={"action_item_"+index} className={"action_item_class"}>
                <div>
                    <div>Command</div>
                    <input type={"text"} name={"command_"+index} value={action_item.command} onChange={(e)=>{setDataAction(e.target.value, "command")}}/>
                </div>

                <label>Params:
                <div id={"params_form"} style={{display:"flex", flexDirection:"column"}} >
                    {action_item.params.map((_, index_param)=>{
                        return(<div>
                            <input type={"text"} name={"params_"+index+"_"+index_param} onChange={(e)=>{setDataAction(e.target.value, "params", index_param)}} value={action_item.params[index_param]}/>
                                {index_param == action_item.params.length-1 ? <button type={"button"} onClick={()=>{deleteParam(index, index_param)}}>-</button> : <div></div>}

                            </div>
                        )
                    })}

                </div>
                <button type={"button"} onClick={()=>{addParam(index)}}>+</button>
            </label>

                <label >Env Params:
                    <div className={"env_params_form"} id={"env_params_form"} >
                        <div>Key:</div>
                        <div>Value:</div>
                        <div></div>
                        {action_item.env_params.map((_, index_env_param)=>{
                                return(<>
                                        <input type={"text"} name={"env_params_key_"+index+"_"+index_env_param} onChange={(e)=>{setDataAction(e.target.value, "env_params", index_env_param, "key")}} value={action_item.env_params[index_env_param].key}/>
                                        <input type={"text"} name={"env_params_value_"+index+"_"+index_env_param} onChange={(e)=>{setDataAction(e.target.value, "env_params", index_env_param, "value")}} value={action_item.env_params[index_env_param].value}/>
                                        {index_env_param == action_item.env_params.length-1 ?  <button type={"button"} onClick={()=>{deleteEnvParam(index, index_env_param)}}>-</button> : <div></div>}
                                        </>
                                )})
                                }
                    </div>
                    <button type={"button"} onClick={()=>{addEnvParam(index)}}>+</button>
                </label>
        <button onClick={()=>{deleteSelf(index)}} type={"button"}>DELETE ACTION</button>
        </div>)
}

export default ItemActionCreate;