import React from "react";
import {invoke} from "@tauri-apps/api/core";
function prepare_data_command(data: FormData): MenuCategory {
    return {
        category_id:0,
        category_name: data.get("category_name") as string,
    };


}
const CreateNewCategory = ({setStateMenu, menuCategory}:{setStateMenu:Function, menuCategory:Array<MenuCategory>}): React.ReactElement => {
    async function save_category (e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target);
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        let categoryString = JSON.stringify(prepare_data_command(formData));
        console.log(categoryString);
        await invoke("save_category_tauri", {categoryString});
        setStateMenu(menuCategory[0].category_id);
    }

    return (<><form  className={"formNewCommand"} onSubmit={(e)=>{save_category(e)}}>
        <label>Categoria
            <input type={"text"} name={"category_name"}/>
        </label>


        <button type="submit">Guardar Categoria</button>
    </form>
    </>);
}

export {CreateNewCategory};