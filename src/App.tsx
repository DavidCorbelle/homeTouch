import  { ReactElement, useEffect, useState} from "react";
import "./App.css";
import { ESTADOS_MENU } from "./functions/consts";
import { CabecerasBotones } from "./components/botonera_category/CabecerasBotones.tsx";
import {invoke} from "@tauri-apps/api/core";
import {CreateNewAction} from "./components/botonera_actions/CreateNewAction.tsx";
import {BotoneraActions} from "./components/botonera_actions/BotoneraActions.tsx";
import {CreateNewCategory} from "./components/botonera_category/CreateNewCategory.tsx";
import {listen} from "@tauri-apps/api/event";
import {ListActions} from "./components/botonera_actions/ListActions.tsx";
import {UtilsActions} from "./components/botonera_actions/UtilsActions.tsx";
import {ListCategories} from "./components/botonera_category/ListCategories.tsx";
import ConfigMenu from "./components/config/ConfigMenu.tsx";
let initialized = false;


function App() {
  const [menuCategories, setMenuCategories ] = useState<Array<MenuCategory>>([]);
  const [buttonsActions, setButtonsActions ] = useState<Array<MenuAction>>([]);
  const [stateMainMenu, setStateMainMenu] = useState<Number>();
  const [hideCustomizeOptions, setHideCustomizeOptions] = useState<boolean|undefined>(true);
  const [currentAction, setCurrentAction] = useState<undefined|MenuAction>();
  const [currentConfig, setCurrentConfig] = useState<AppCustomConfig>();

  listen<string>('app-updated',()=>{
    initializeData();
  })
  const setStateMenu = (state: Number) => {
    setStateMainMenu(state);
  }
  const setAction = (action: MenuAction|undefined) => {
    setCurrentAction(action);
  }
  const renderButtons = () => {
    let actions = buttonsActions.filter((f)=>{return(f.category_id == stateMainMenu)});
    return(<BotoneraActions actions={actions}></BotoneraActions>)

  }
  const renderMenu = () => {
    switch (stateMainMenu) {
      case ESTADOS_MENU.NEW_ACTION:
        return <CreateNewAction setStateMenu={setStateMenu} menuCategory={menuCategories} currentAction={currentAction} voidActionFunction={setAction}>
        </CreateNewAction>
      case ESTADOS_MENU.NEW_CATEGORY:
        return <CreateNewCategory setStateMenu={setStateMenu} menuCategory={menuCategories}>
        </CreateNewCategory>
      case ESTADOS_MENU.LIST_ACTIONS:
        return <ListActions allActions={buttonsActions} setCurrentAction={setAction} setScreen={setStateMenu}>
        </ListActions>
      case ESTADOS_MENU.MENU_UTILS:
        return <UtilsActions></UtilsActions>
      case ESTADOS_MENU.LIST_CATEGORY:
        return <ListCategories allCategories={menuCategories}></ListCategories>
      case ESTADOS_MENU.MENU_CONFIG:
        return <ConfigMenu returnFunction={setStateMenu}></ConfigMenu>
      default:
        break;
    }

  }

  useEffect(() => {
    if(!initialized){
      initialized = true;
      initializeData();
    }

  }, []);

  useEffect(()=>{

  },[stateMainMenu])
  async function initializeData(){
    setMenuCategories(await invoke("return_category_list", {}));
    setButtonsActions(await invoke("return_action_list", {}));
    setCurrentConfig(await invoke("get_config", {}));
  }
  function getBodyStyle():ReactElement{
    let stylesString = "";
  if(currentConfig?.background_image != undefined && currentConfig.background_image!=""){
    stylesString += "background-image: url("+ currentConfig.background_image+"); ";
    stylesString += "background-repeat: no-repeat;";
    stylesString += "background-size: 100% auto;";
    stylesString += "background-position: center;";
  }
    let style = <style>{":root {"+stylesString+"}"}</style>;
    return style;
  }
  return (
    <main className="container" >
      <div className={"containerBotones containerConfig"}>
        {hideCustomizeOptions ?
            <button className={"textButton buttonBotoneraCabecera"} onClick={()=>{setHideCustomizeOptions(false)}}>Mostrar Opciones</button>:
            <button className={"textButton buttonBotoneraCabecera"} onClick={()=>{setHideCustomizeOptions(true)}}>Ocultar Opciones</button>
        }
        <button className={"textButton buttonBotoneraCabecera"} hidden={hideCustomizeOptions} onClick={()=>{setCurrentAction(undefined);setStateMenu(ESTADOS_MENU.NEW_ACTION)}}>Nueva Accion</button>
        <button className={"textButton buttonBotoneraCabecera"} hidden={hideCustomizeOptions} onClick={()=>{setStateMenu(ESTADOS_MENU.NEW_CATEGORY)}}>Nueva Categoria</button>
        <button className={"textButton buttonBotoneraCabecera"} hidden={hideCustomizeOptions} onClick={()=>{setStateMenu(ESTADOS_MENU.LIST_CATEGORY)}}>Listado Categorias</button>
        <button className={"textButton buttonBotoneraCabecera"} hidden={hideCustomizeOptions} onClick={()=>{setStateMenu(ESTADOS_MENU.LIST_ACTIONS)}}>Listado Acciones</button>
        <button className={"textButton buttonBotoneraCabecera"} hidden={hideCustomizeOptions} onClick={()=>{setStateMenu(ESTADOS_MENU.MENU_CONFIG)}}>Configuracion</button>
      </div>
      <div className="cabeceraBotones">
        <CabecerasBotones setFunction={setStateMenu} category_list={menuCategories} ></CabecerasBotones>
      </div>
      <div className="containerBotones">
        {renderMenu()}
      </div>
      <div className="containerBotones">
        {renderButtons()}
      </div>
      <div id="youtube-container" className="container hidden">
      </div>
      {getBodyStyle()}
    </main>

  );
}

export default App;
