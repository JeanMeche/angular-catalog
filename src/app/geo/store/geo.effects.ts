import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { GeoActions } from './geo.action';
import { GeoState } from './geo.reducer';
import { GeoResource } from './geo.resource';

@Injectable({ providedIn: 'root' })
export class TreeEffects {
  constructor(
    private actions$: Actions,
    private geoResource: GeoResource,
    private readonly router: Router,
    private readonly store: Store<GeoState>
  ) {}

  getRegions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadRegions),
      switchMap(() => this.geoResource.getRegions()),
      map((regions) => GeoActions.loadRegionsSuccess({ regions }))
    );
  });

  // getDepartement$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(GeoActions.loadDepartements),
  //     tap(({ codeRegion }) => this.router.navigate(['geo', codeRegion])),
  //     switchMap(({ codeRegion }) => forkJoin([of(codeRegion), this.geoResource.getDepartements(codeRegion)])),
  //     map(([codeRegion, departements]) => GeoActions.loadDepartementsSuccess({ departements, codeRegion }))
  //   );
  // });

  // getCommunes$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(GeoActions.loadCommunes),
  //     switchMap(({ codeRegion, codeDepartement }) =>
  //       forkJoin([of(codeRegion), of(codeDepartement), this.geoResource.getCommunes(codeRegion)])
  //     ),
  //     map(([codeRegion, codeDepartement, communes]) =>
  //       GeoActions.loadCommunesSuccess({ communes, codeRegion, codeDepartement })
  //     )
  //   );
  // });

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
      ofType(GeoActions.loadCommune),
      switchMap((action) => {
        return this.geoResource.getCommune(action.codeCommune);
      }),
      map((commune) => GeoActions.loadCommuneSuccess({ commune }))
    );
  });

  getCommuneDetailFromLocation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeoActions.loadCommuneFromLocation),
      switchMap((action) => {
        return this.geoResource.getCommuneFromLocation({ lat: action.lat, lon: action.lon });
      }),
      map((commune) => GeoActions.loadCommuneSuccess({ commune }))
    );
  });

  navigateCommune = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(GeoActions.navigateToCommune),
        map((action) => {
          this.router.navigate(['geo', action.codeCommune]);
        })
      );
    },
    { dispatch: false }
  );
}
