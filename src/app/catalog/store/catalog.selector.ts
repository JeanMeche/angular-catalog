import { createSelector } from '@ngrx/store';
import { CatalogState, Category, ContentType, featureKey } from './catalog.reducer';

export const selectFeature = (state: any): CatalogState => state[featureKey];

export const selectCategories = createSelector(selectFeature, (state: CatalogState) => state.categories);

export const selectCatagory = (oid: number) =>
  createSelector(selectCategories, ({ list }) => {
    const flat = flattenCategories(list);
    return flat.find((c) => c?.oid === oid);
  });

export const selectCurrentCatalog = createSelector(selectFeature, (state: CatalogState) => state.selectedCatalog);

export const selectCatalogs = createSelector(selectFeature, (state: CatalogState) => state.catalogs);

export const selectProductStatus = createSelector(selectFeature, (state: CatalogState) => state.productStatus);

export const selectSelectedContentType = createSelector(selectFeature, (state: CatalogState) => state.selectedContent);

export const selectSelectedCategory = createSelector(selectFeature, (state: CatalogState) => state.selectedCategory);

export const selectSelectedCategoryAndContentType = createSelector(
  selectSelectedCategory,
  selectCategories,
  (
    selectedCategory: { oid: number; selectedContent?: ContentType } | undefined,
    categories: { list: Array<Category> }
  ) => {
    return {
      category: categories.list.flatMap((cat) => cat.children ?? []).find((cat) => cat.oid === selectedCategory?.oid),
      contentType: selectedCategory?.selectedContent,
    };
  }
);

export const selectProductContent = (contentType: ContentType) =>
  createSelector(selectFeature, (state: CatalogState) => state.selectedCategory?.content?.[contentType]);

const flattenCategories = (categories: Array<Category>): Array<Category> => {
  return categories.flatMap((cat) => [cat, ...(cat.children ? flattenCategories(cat.children) : [])]);
};
