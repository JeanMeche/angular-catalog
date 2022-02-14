import { CategoriesActions } from './catalog.actions';
import { CatalogState, reducer } from './catalog.reducer';

describe('Reducer: Categories', () => {
  it('Reducer should create a new state', () => {
    const action = CategoriesActions.loadSubcategoriesSuccess({
      oid: 1,
      newCategories: [
        { oid: 2, label: 'l2', cultureCode: 'en-us', isLoading: false, level: 1, status: new Set(['L', 'F']) },
      ],
    });
    const state: CatalogState = {
      categories: [{ oid: 1, label: '1', cultureCode: 'en-us', isLoading: false, level: 2, status: new Set(['L']) }],
      isLoading: false,
      catalogs: [],
      search: {},
    };
    expect(reducer(state, action)).not.toEqual(state);
    expect(reducer(state, action).categories[0].children?.length).toEqual(1);
    expect(reducer(state, action).categories[0].children?.[0].oid).toEqual(2);
  });
});
