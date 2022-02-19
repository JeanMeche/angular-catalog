import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { GeoActions } from './geo.action';
import { CommuneDetail, Region } from './geo.interface';

export const featureKey = 'geo';

export type GeoState = {
  regions: Array<Region>;
  isLoading: boolean;
  selectedGeo?: string;
  communeDetail?: CommuneDetail;
};

const initialState: GeoState = { regions: [], isLoading: true };

export const geoReducer = createReducer(
  initialState,
  on(GeoActions.loadRegions, (state) => {
    return { ...state, isLoading: true };
  }),
  on(GeoActions.loadRegionsSuccess, (state, { regions }) => {
    return { ...state, isLoading: false, regions };
  }),
  on(GeoActions.loadDepartements, (state, { codeRegion }) => {
    return produce(state, (draft) => {
      const region = draft.regions.find((r) => r.codeRegion === codeRegion);
      if (region) {
        region.isLoading = true;
      }
    });
  }),
  on(GeoActions.loadDepartementsSuccess, (state, { codeRegion, departements }) => {
    return produce(state, (draft) => {
      const region = draft.regions.find((r) => r.codeRegion === codeRegion);
      if (region) {
        region.isLoading = true;
        region.departements = departements;
      }
    });
  }),
  on(GeoActions.loadCommunes, (state, { codeRegion, codeDepartement }) => {
    return produce(state, (draft) => {
      const region = draft.regions.find((r) => r.codeRegion === codeRegion);
      if (region) {
        const departement = region.departements.find((d) => d.codeDepartement === codeDepartement);
        if (departement) {
          departement.isLoading = true;
        }
      }
    });
  }),
  on(GeoActions.loadCommunesSuccess, (state, { codeRegion, codeDepartement, communes }) => {
    return produce(state, (draft) => {
      const region = draft.regions.find((r) => r.codeRegion === codeRegion);
      if (region) {
        const departement = region.departements.find((d) => d.codeDepartement === codeDepartement);
        if (departement) {
          departement.isLoading = true;
          departement.communes = communes;
        }
      }
    });
  }),
  on(GeoActions.selectGeo, (state, { geo }) => {
    return produce(state, (draft) => {
      draft.selectedGeo = geo.id;
      const region = draft.regions.find((r) => r.id === geo.codeRegion);
      if (region) {
        region.isLoading = true;
      }
    });
  }),
  on(GeoActions.selectCommune, (state, { commune }) => {
    return produce(state, (draft) => {
      draft.selectedGeo = commune.id;
    });
  }),
  on(GeoActions.loadCommuneSuccess, (state, { commune }) => {
    return produce(state, (draft) => {
      draft.communeDetail = commune;
    });
  })
);
