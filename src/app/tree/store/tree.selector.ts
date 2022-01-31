import { createSelector } from '@ngrx/store';
import { featureKey, TreeState } from './tree.reducer';

export interface FeatureState {
    counter: number;
}

export const selectFeature = (state: any): TreeState => state[featureKey];

export const selectCategories = createSelector(
    selectFeature,
    (state: TreeState) => state.categories
);