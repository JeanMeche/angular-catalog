import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap } from 'rxjs'
import { TreeActions } from './tree.action'
import { TreeResource } from './tree.resource'

@Injectable({ providedIn: 'root' })
export class TreeEffects {

    loadCategories$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TreeActions.initTree),
            switchMap(() => {
                return this.treeResource.getCategories()
            }),
            map((categories) => {
                return TreeActions.initTreeSuccess({ categories })
            })
        )
    })


    loadSubCategories = createEffect(() => {
        return this.actions$.pipe(
            ofType(TreeActions.loadSubcategories),
            switchMap((action) => {
                return this.treeResource.getSubCategories(action.categoryId)
            }),
            map((result) => {
                return TreeActions.loadSubcategoriesSuccess({
                    categoryId: result.categoryId,
                    newCategories: result.children
                })
            })
        )
    })

    constructor(private actions$: Actions, private treeResource: TreeResource) { }
}