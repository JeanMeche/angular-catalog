import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { GeoActions } from './geo.action';
import { GeoResource } from './geo.resource';

@Injectable({ providedIn: 'root' })
export class TreeEffects {
  constructor(private actions$: Actions, private geoResource: GeoResource) {}

  getRegions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadRegions),
      switchMap(() => this.geoResource.getRegions()),
      map((regions) => GeoActions.loadRegionsSuccess({ regions }))
    );
  });

  getDepartement$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadDepartements),
      switchMap(({ codeRegion }) => forkJoin([of(codeRegion), this.geoResource.getDepartements(codeRegion)])),
      map(([codeRegion, departements]) => GeoActions.loadDepartementsSuccess({ departements, codeRegion }))
    );
  });

  getCommunes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadCommunes),
      switchMap(({ codeRegion, codeDepartement }) =>
        forkJoin([of(codeRegion), of(codeDepartement), this.geoResource.getCommunes(codeRegion)])
      ),
      map(([codeRegion, codeDepartement, communes]) =>
        GeoActions.loadCommunesSuccess({ communes, codeRegion, codeDepartement })
      )
    );
  });

  getGeo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadGeo),
      switchMap(({ geo }) => {
        switch (geo.type) {
          case 'Region':
            return this.geoResource.getDepartements(geo.codeRegion);
          case 'Departement':
            return this.geoResource.getCommunes(geo.codeDepartement);
          default:
            throw new Error();
        }
      }),
      map((geos) => GeoActions.loadGeoSuccess({ geos }))
    );
  });

  getCommuneDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.selectCommune),
      switchMap((action) => {
        return this.geoResource.getCommune(action.commune.codeCommune);
      }),
      map((commune) => GeoActions.loadCommuneSuccess({ commune }))
    );
  });
}
