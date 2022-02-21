import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base.component';
import { GeoActions } from '../../store/geo.action';
import { Commune } from '../../store/geo.interface';
import { GeoState } from '../../store/geo.reducer';
import { GeoResource } from '../../store/geo.resource';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends BaseComponent {
  searchControl = new FormControl();

  vo$: Observable<{
    suggestions: Array<Commune> | undefined;
  }>;

  constructor(private geoResource: GeoResource, private store: Store<GeoState>) {
    super();
    const searchResult$ = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      switchMap((searchStr) => {
        return this.geoResource.searchAutocomplete(searchStr);
      }),
      startWith(undefined)
    );

    this.vo$ = combineLatest([searchResult$]).pipe(
      map(([searchResult]) => {
        return {
          suggestions: searchResult?.result,
        };
      })
    );
  }

  displayWith = (commune?: Commune): string => {
    return commune?.codeCommune ?? '';
  };

  selectedCommune($event: MatAutocompleteSelectedEvent) {
    this.store.dispatch(GeoActions.navigateToCommune({ codeCommune: $event.option.value.codeCommune }));
  }
}
