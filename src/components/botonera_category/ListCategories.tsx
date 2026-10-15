import {invoke} from "@tauri-apps/api/core";

const ListCategories = ({allCategories}:{allCategories:Array<MenuCategory>}) =>  {

    return(<div className={"categoryList"}>
        {allCategories? allCategories.map((category:MenuCategory)=>{
            return(<><div>{category.category_name}</div>
                <button onClick={()=>{let categoryId = category.category_id;invoke('delete_category', {categoryId} )}}>Delete</button></>)
        }) : null }
        </div>)

}
export {ListCategories}