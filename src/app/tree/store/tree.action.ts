import { createAction, props } from "@ngrx/store";
import { Category } from "./tree.state";

export namespace TreeActions {
    export const initTree = createAction('[Tree] Init')
    export const initTreeSuccess = createAction('[Tree] Init success', props<{ categories: Array<Category> }>())

    export const loadSubcategories = createAction('[Tree] load subcategories', props<{ categoryId: string }>())
    export const loadSubcategoriesSuccess = createAction('[Tree] load subcategories success', props<{ categoryId: string, newCategories: Array<Category> }>())
}