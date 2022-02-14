import { createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CatalogActions, CategoriesActions, ProductActions } from './catalog.actions';

export const featureKey = 'catalog';

export interface Catalog {
  id: number;
  name: string;
  code: string;
}

export type ProductStatus = 'O' | 'F' | 'L';

export const kvContentTypesList = ['MSG', 'TSP', 'SYS', 'LOG', 'PIC', 'OTH'] as const;
export type kvContentTypes = typeof kvContentTypesList[number];

export const contentTypeList = [
  ...kvContentTypesList,
  'IMG',
  'DOC',
  'LNK',
  'HST',
  'VID',
  // 'RAT', ???? Todo: CHECK for this one
  'MDA',
  'RC',
] as const;
export type ContentType = typeof contentTypeList[number];

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: never;
};

export type Category = {
  oid: number;
  label: string;
  children?: Array<Category>;
  level: number;
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
  };
  productStatus: Set<ProductStatus>;
  selectedContent: ContentType;
  selectedCategory?: {
    oid: number;
    content?: Content;
    isLoading: boolean;
  };
}

export type Content = {
  [k in kvContentTypes]:
    | {
        oid: number;
        productNumber?: string;
        productName: string;
        others: Array<{ key: string; value: string }>;
      }
    | undefined;
} & { [k in Exclude<ContentType, kvContentTypes>]: {} };

export const initialState: CatalogState = {
  catalogs: [],
  isLoading: false,
  search: {},
  categories: { isLoading: false, list: [] },
  productStatus: new Set(['L', 'O']),
  selectedContent: 'MSG',
};

export const reducer = createReducer(
  initialState,
  on(CatalogActions.init, (state) => ({ ...state, isLoading: true })),
  on(CatalogActions.initSuccess, (state, action) => ({ ...state, isLoading: false, catalogs: action.catalogs })),
  on(CatalogActions.selectCatalog, (state, action) => ({ ...state, selectedCatalog: action.selectedCatalog })),

  on(CategoriesActions.initTree, (state) => {
    return { ...state, categories: { list: [], isLoading: true } };
  }),
  on(CategoriesActions.initTreeSuccess, (state, { categories }) => {
    return { ...state, categories: { list: categories, isLoading: false } };
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

  on(ProductActions.selectProductStatus, (state, { status }) => {
    return { ...state, productStatus: status };
  }),
  on(ProductActions.selectCategory, (state, { category }) => {
    return {
      ...state,
      selectedCategory: {
        oid: category.oid,
        content: undefined,
        isLoading: true,
      },
    };
  }),

  on(ProductActions.getContentSuccess, (state, { category, contentType, content }) => {
    const retVal: CatalogState = {
      ...state,
      selectedCategory: {
        oid: category.oid,
        ...state.selectedCategory,
        content: {
          [contentType]: content,
        } as any,
        isLoading: false,
      },
    };
    return retVal;
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
