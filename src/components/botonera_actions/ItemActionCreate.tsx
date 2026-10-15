const ItemActionCreate = ({deleteEnvParam, deleteParam, addEnvParam, addParam, index, action_item}:{deleteEnvParam:Function, deleteParam:Function, addEnvParam:Function, addParam:Function, index:number, action_item:MenuActionItem})=>{


    return(<div id={"action_item_"+index} className={"action_item_class"}>
                <div>
                    <div>Command</div>
                    <input type={"text"} name={"command_"+index} defaultValue={action_item?.command}/>
                </div>

                <label>Params:
                <div id={"params_form"} style={{display:"flex", flexDirection:"column"}} >
                    {action_item.params.map((param, index_param)=>{
                        return(<div>
                            <input type={"text"} name={"params_"+index+"_"+index_param} defaultValue={param}/>
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
                        {action_item.env_params.map((env_param, index_env_param)=>{
                                return(<>
                                        <input type={"text"} name={"env_params_key_"+index+"_"+index_env_param} defaultValue={env_param.key}/>
                                        <input type={"text"} name={"env_params_value_"+index+"_"+index_env_param} defaultValue={env_param.value}/>
                                        {index_env_param == action_item.env_params.length-1 ?  <button type={"button"} onClick={()=>{deleteEnvParam(index, index_env_param)}}>-</button> : <div></div>}
                                        </>
                                )})
                                }
                    </div>
                    <button type={"button"} onClick={()=>{addEnvParam(index)}}>+</button>
                </label></div>)
}

export default ItemActionCreate;