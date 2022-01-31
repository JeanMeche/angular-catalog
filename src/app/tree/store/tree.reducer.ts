import { createReducer, on } from '@ngrx/store';
import { TreeActions } from './tree.action';
import { produce } from 'immer';
import { Category } from './tree.state';

export const featureKey = 'tree';

export type TreeState = { categories: Array<Category>; isLoading: boolean };

const initialState: TreeState = { categories: [], isLoading: true };

export const treeReducer = createReducer(
  initialState,
  on(TreeActions.initTreeSuccess, (state, { categories }) => {
    return { isLoading: false, categories };
  }),
  on(TreeActions.loadSubcategories, (state, { categoryId }) => {
    return state;
  }),
  on(
    TreeActions.loadSubcategoriesSuccess,
    (state, { categoryId, newCategories }) => {
      return produce(state, (draft) => {
        draft.categories.forEach((subCat, i) => {
          draft.categories[i] = foo(
            draft.categories[i],
            categoryId,
            newCategories
          );
        });
      });
    }
  )
);

const foo = (
  cat: Category,
  categoryId: string,
  newSubCats: Array<Category>
): Category => {
  if (cat.id === categoryId) {
    cat.children = newSubCats;
    return cat;
  } else {
    return produce(cat, (draft) => {
      const subCats = draft.children;
      if (subCats) {
        subCats?.forEach((subCat, i) => {
          subCats[i] = foo(subCats[i] as any, categoryId, newSubCats);
        });
      }
    });
  }
};
