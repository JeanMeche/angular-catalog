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

export const selectCatalogsAndCurrent = createSelector(selectCatalogs, selectCurrentCatalog, (catalogs, current) => {
  return {
    catalogs,
    current,
  };
});

export const selectProductStatus = createSelector(selectFeature, (state: CatalogState) => state.productStatus);

export const selectSelectedContentType = createSelector(selectFeature, (state: CatalogState) => state.selectedContent);

export const selectSelectedCategory = createSelector(selectFeature, (state: CatalogState) => state.selectedCategory);

export const selectCatalogParams = createSelector(selectCurrentCatalog, selectProductStatus, (catalog, status) => {
  return { catalog, status };
});

export const selectStatusAndContentType = createSelector(
  selectProductStatus,
  selectSelectedContentType,
  (productStatus, contentType) => {
    return {
      productStatus,
      contentType,
    };
  }
);

export const selectCategoriesAndSelected = createSelector(
  selectCategories,
  selectSelectedCategory,
  (categories, current) => {
    return { categories, current };
  }
);

export const selectSelectedCategoryAndContentType = createSelector(
  selectCategoriesAndSelected,
  ({ current, categories }) => {
    return {
      category: categories.list.flatMap((cat) => cat.children ?? []).find((cat) => cat.oid === current?.oid),
      contentType: current?.content,
    };
  }
);

export const selectProductContent = createSelector(
  selectFeature,
  (state: CatalogState) => state.selectedCategory?.content
);

export const selectProductContentByType = (contentType: ContentType) =>
  createSelector(selectProductContent, (content) => content?.[contentType]);

const flattenCategories = (categories: Array<Category>): Array<Category> => {
  return categories.flatMap((cat) => [cat, ...(cat.children ? flattenCategories(cat.children) : [])]);
};
