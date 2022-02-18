import { createReducer, on } from '@ngrx/store';
import { GeoActions } from './geo.action';
import { produce } from 'immer';

export const featureKey = 'geo';

type GeoBase = {
  id: string;
  codeRegion: string;
  nom: string;
  type: 'Region' | 'Departement' | 'Commune';
};

export type Region = GeoBase & {
  departements: Array<Departement>;
  isLoading: boolean;
  type: 'Region';
};

export type Departement = GeoBase & {
  codeDepartement: string;
  communes: Array<Commune>;
  isLoading: boolean;
  type: 'Departement';
};

export type Commune = GeoBase & {
  codeCommune: string;
  codesPostaux: Array<string>;
  codeDepartement: string;
  type: 'Commune';
};

export type CommuneDetail = Commune & {
  population: number;
  surface: number;
  centre: object;
  contour: object;
};

export type GeoTypes = Region | Departement | Commune;

export type GeoState = { regions: Array<Region>; isLoading: boolean; selectedGeo?: string };

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
  })
);
