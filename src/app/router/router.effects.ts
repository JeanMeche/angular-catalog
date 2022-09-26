import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { GeoActions } from '../geo/store/geo.action';
import { GeoState } from '../geo/store/geo.reducer';
import { isDefined } from '../helpers/helpers';
import { selectRouteParam } from './router.selector';

@Injectable({ providedIn: 'root' })
export class RouterEffects {
  constructor(private readonly store: Store<GeoState>) {}

  loadCommune$ = createEffect(() => {
    return this.store.select(selectRouteParam('codeCommune')).pipe(
      filter(isDefined),
      map((codeCommune) => GeoActions.loadCommune({ codeCommune }))
    );
  });
}
