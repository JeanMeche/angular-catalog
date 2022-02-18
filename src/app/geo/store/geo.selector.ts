import { createSelector } from '@ngrx/store';
import { featureKey, GeoState } from './geo.reducer';

export interface FeatureState {
  counter: number;
}

export const selectFeature = (state: any): GeoState => state[featureKey];

export const selectRegions = createSelector(selectFeature, (state) => state.regions);

export const selectRegion = (codeRegion: string) =>
  createSelector(selectRegions, (regions) => regions.find((r) => r.codeRegion === codeRegion));

// export const selectDepartements = (codeRegion: string) =>
//   createSelector(selectRegion(codeRegion), (regions) => regions?.departements.find((r) => r.codeRegion === codeRegion));

// export const selectCommunes = (codeDepartement: string) =>
//   createSelector(selectDepartements(codeDepartement), (departements) =>
//     departements?.communes.find((c) => c.codeDepartement === codeDepartement)
//   );
