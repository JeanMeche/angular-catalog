import { createAction, props } from '@ngrx/store';
import { Commune, CommuneDetail, Departement, GeoTypes, Region } from './geo.interface';

export namespace GeoActions {
  export const loadRegions = createAction('[Geo] load Regions');
  export const loadRegionsSuccess = createAction('[Geo] load Regions sucess', props<{ regions: Array<Region> }>());

  export const loadDepartements = createAction('[Geo] load departements', props<{ codeRegion: string }>());
  export const loadDepartementsSuccess = createAction(
    '[Geo] load departements success',
    props<{ codeRegion: string; departements: Array<Departement> }>()
  );
  export const loadCommunes = createAction(
    '[Geo] load communes',
    props<{ codeRegion: string; codeDepartement: string }>()
  );
  export const loadCommunesSuccess = createAction(
    '[Geo] load communes success',
    props<{ codeRegion: string; codeDepartement: string; communes: Array<Commune> }>()
  );

  export const loadCommune = createAction('[Geo] load commune', props<{ codeCommune: string }>());
  export const loadCommuneSuccess = createAction('[Geo] load commune success', props<{ commune: CommuneDetail }>());

  export const loadGeo = createAction('[Geo] load geo', props<{ geo: GeoTypes }>());

  export const loadGeoSuccess = createAction('[Geo] load geo success', props<{ geos: Array<GeoTypes> }>());

  export const selectGeo = createAction('[Geo] select', props<{ geo: GeoTypes }>());

  export const selectCommune = createAction('[Geo] select commune', props<{ commune: Commune }>());
}
