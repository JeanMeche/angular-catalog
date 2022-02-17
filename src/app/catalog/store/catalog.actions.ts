import { createAction, props } from '@ngrx/store';
import { Catalog, Category, Content, ContentType, ProductStatus } from './catalog.reducer';

export namespace RoutingActions {
  export const paramsFromRoute = createAction(
    '[Route] Params from route',
    props<{ oid?: number; catalogId?: string }>()
  );
}

export namespace CatalogActions {
  export const init = createAction('[Catalog] Init');
  export const initSuccess = createAction('[Catalog] Init success', props<{ catalogs: Array<Catalog> }>());
  export const selectCatalog = createAction('[Catalog] select Catalog', props<{ selectedCatalog: string }>());
}

export namespace CategoriesActions {
  export const initTree = createAction('[Tree] Init');
  export const initTreeSuccess = createAction('[Tree] Init success', props<{ categories: Array<Category> }>());

  export const setTreeHierarchy = createAction('[Tree] Set Tree Hierarchy', props<{ hierarchy: 'F' | 'Q' }>());

  export const loadSubcategories = createAction('[Tree] load subcategories', props<{ category: Category }>());
  export const loadSubcategoriesSuccess = createAction(
    '[Tree] load subcategories success',
    props<{ oid: number; newCategories: Array<Category> }>()
  );
  export const loadSubcategoriesError = createAction('[Tree] load subcategories error', props<{ oid: number }>());

  export const loadParentCategories = createAction('[Tree] load parent categories', props<{ oids: Array<number> }>());
  export const loadParentCategoriesSuccess = createAction(
    '[Tree] load parent categories success',
    props<{ categories: Array<{ oid: number; children: Array<Category> }> }>()
  );
}

export namespace ProductActions {
  export const selectProductStatus = createAction('[Product] Select status', props<{ status: Set<ProductStatus> }>());
  export const selectCategory = createAction('[Product] Select category', props<{ category: Category }>());
  export const selectContent = createAction('[Product] Select content', props<{ content: ContentType }>());
  export const getContent = createAction(
    '[Product] Get Content',
    props<{ oid: number; cultureCode: string; contentType: ContentType }>()
  );
  export const getContentSuccess = createAction(
    '[Product] Get Content Success',
    props<{ oid: number; contentType: ContentType; content: Content }>()
  );
}
