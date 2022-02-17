import { createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CatalogActions, CategoriesActions, ProductActions, RoutingActions } from './catalog.actions';

export const featureKey = 'catalog';

export interface Catalog {
  id: number;
  name: string;
  code: string;
}

export type ProductStatus = 'O' | 'F' | 'L';

export const kvContentTypesList = ['MSG', 'TSP', 'SYS', 'LOG', 'PIC', 'OTH'] as const;
export type kvContentTypes = typeof kvContentTypesList[number];

export const contentTypeList = [...kvContentTypesList, 'IMG', 'DOC', 'LNK', 'HST', 'VID', 'RAT', 'MDA', 'RC'] as const;
export type ContentType = typeof contentTypeList[number];

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: never;
};

export type BaseCategory = {
  oid: number;
  label: string;
  level: number;
};

export type Category = BaseCategory & {
  children?: Array<Category>;
  cultureCode: string;
  status: Set<ProductStatus>;
  isLoading: boolean;
};

export interface Product extends Category {
  isProduct: true;
  prodnum: string;
  productline: string;
}

export interface CatalogState {
  catalogs: Array<Catalog>;
  selectedCatalog?: string;
  isLoading: boolean;
  search: {
    text?: string;
    result?: Array<any>;
  };
  categories: {
    list: Array<Category>;
    isLoading: boolean;
    hierarychy: 'F' | 'Q';
  };
  productStatus: Set<ProductStatus>;
  selectedContent: ContentType;
  selectedCategory?: {
    cultureCode: string;
    oid: number;
    content?: { [k in ContentType]?: LoadableContent<Content> };
  };
}

export type Content<T = { key: string; value: string }> = {
  oid: number;
  productNumber?: string;
  productLine?: string;
  productName: string;
  others: Array<T>;
  parents: Array<BaseCategory>;
  level: number;
};

export type LoadableContent<T extends Content> = { isLoading: boolean; items?: T };

export const initialState: CatalogState = {
  catalogs: [],
  isLoading: false,
  search: {},
  categories: { isLoading: true, list: [], hierarychy: 'F' },
  productStatus: new Set(['L', 'O']),
  selectedContent: 'MSG',
};

export const reducer = createReducer(
  initialState,

  on(RoutingActions.paramsFromRoute, (state, action) => ({
    ...state,
    selectedCatalog: action.catalogId,
    selectedCategory: action.oid && action.catalogId ? { oid: action.oid, cultureCode: action.catalogId } : undefined,
  })),
  on(CatalogActions.init, (state) => ({ ...state, isLoading: true })),
  on(CatalogActions.initSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    catalogs: action.catalogs,
    selectedCatalog: state.selectedCatalog ?? action.catalogs[0].code,
  })),
  on(CatalogActions.selectCatalog, (state, action) => ({
    ...state,
    selectedCatalog: action.selectedCatalog,
    selectedCategory: undefined,
  })),

  on(CategoriesActions.initTree, (state) => {
    return { ...state, categories: { list: [], isLoading: true, hierarychy: state.categories.hierarychy } };
  }),
  on(CategoriesActions.initTreeSuccess, (state, { categories }) => {
    return { ...state, categories: { list: categories, isLoading: false, hierarychy: state.categories.hierarychy } };
  }),
  on(CategoriesActions.setTreeHierarchy, (state, { hierarchy }) => {
    return produce(state, (draft) => {
      draft.categories.hierarychy = hierarchy;
    });
  }),

  on(CategoriesActions.loadSubcategories, (state, { category: { oid } }) => {
    return produce(state, (draft) => {
      draft.categories.list.forEach((subCat, i) => {
        draft.categories.list[i] = setloading(draft.categories.list[i], oid, true);
      });
    });
  }),
  on(CategoriesActions.loadSubcategoriesSuccess, (state, { oid, newCategories }) => {
    return produce(state, (draft) => {
      draft.categories.list.forEach((subCat, i) => {
        draft.categories.list[i] = updateChildren(draft.categories.list[i], oid, newCategories);
      });
    });
  }),
  on(CategoriesActions.loadParentCategoriesSuccess, (state, list) => {
    return produce(state, (draft) => {
      list.categories.forEach((cat) => {
        draft.categories.list.forEach((subCat, i) => {
          draft.categories.list[i] = updateChildren(draft.categories.list[i], cat.oid, cat.children);
        });
      });
    });
  }),

  on(ProductActions.selectProductStatus, (state, { status }) => {
    return { ...state, productStatus: status };
  }),
  on(ProductActions.selectCategory, (state, { category }) => {
    return produce(state, (draft) => {
      draft.selectedCategory = {
        oid: category.oid,
        cultureCode: category.cultureCode,
        content: undefined,
      };
    });
  }),
  on(ProductActions.selectContent, (state, { content }) => {
    return { ...state, selectedContent: content };
  }),

  on(ProductActions.getContent, (state, { contentType, oid, cultureCode }) => {
    return produce(state, (draft) => {
      if (!draft.selectedCategory) {
        draft.selectedCategory = {
          oid,
          cultureCode,
          content: {},
        };
      }

      if (!draft.selectedCategory.content) {
        draft.selectedCategory.content = { [contentType]: { isLoading: true } };
      } else {
        draft.selectedCategory.content[contentType] = { isLoading: true };
      }
    });
  }),

  on(ProductActions.getContentSuccess, (state, { contentType, content }) => {
    return produce(state, (draft) => {
      const _content = draft.selectedCategory?.content?.[contentType];
      if (_content) {
        _content.items = content;
        _content.isLoading = false;
      }
    });
  })
);

/** Private functions  */

const setloading = (cat: Category, categoryId: number, isLoading: boolean): Category => {
  if (cat.oid === categoryId) {
    cat.isLoading = isLoading;
    return cat;
  } else {
    return produce(cat, (draft) => {
      const subCats = draft.children;
      if (subCats) {
        subCats?.forEach((subCat, i) => {
          subCats[i] = setloading(subCats[i] as any, categoryId, isLoading);
        });
      }
    });
  }
};

const updateChildren = (cat: Category, categoryId: number, newSubCats: Array<Category>): Category => {
  if (cat.oid === categoryId) {
    cat.children = newSubCats;
    // cat.isLoading = false;
    return cat;
  } else {
    return produce(cat, (draft) => {
      const subCats = draft.children;
      if (subCats) {
        subCats?.forEach((subCat, i) => {
          subCats[i] = updateChildren(subCats[i] as any, categoryId, newSubCats);
        });
      }
    });
  }
};
