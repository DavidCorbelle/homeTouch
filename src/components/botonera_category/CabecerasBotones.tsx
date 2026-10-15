import React from "react";
import {ESTADOS_MENU} from "../../functions/consts.tsx";

const CabecerasBotones = ({setFunction, category_list}:BotoneraProps): React.ReactElement => {
    return (<>
        <button className="textButton buttonBotoneraCabecera" onClick={()=>setFunction(ESTADOS_MENU.MENU_UTILS)}>Utils</button>
        {category_list ? category_list.map((c) => {
        return (<button className="textButton buttonBotoneraCabecera"
                        onClick={() => setFunction(c.category_id)}> {c.category_name}</button>)
    }) : null}</>);
}

export {CabecerasBotones};