import { TreeActions } from './geo.action';
import { treeReducer } from './geo.reducer';
import { Category } from './tree.state';

describe('Reducer: Tree', () => {
    it('Reducer should create a new state', () => {
        const action = TreeActions.loadSubcategoriesSuccess({ categoryId: '1', newCategories: [{ id: '2', label: 'l2', type: 'category' }] })
        const state = { categories: [{ id: '1', label: '1', type: 'category' } as Category], isLoading: false };
        expect(treeReducer(state, action)).not.toEqual(state);
        expect(treeReducer(state, action).categories[0].children?.length).toEqual(1);
        expect(treeReducer(state, action).categories[0].children?.[0].id).toEqual('2');
    });
});
