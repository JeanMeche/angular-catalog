import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { CatalogResource, SearchAutocompleleteItem } from '../../store/catalog.resource';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  searchControl = new FormControl();
  exactSearchControl = new FormControl(false);

  onDestroy$ = new BehaviorSubject(undefined);

  vo$: Observable<{
    suggestions: Array<SearchAutocompleleteItem> | undefined;
  }>;

  constructor(private catalogResource: CatalogResource) {
    const searchResult$ = combineLatest([this.searchControl.valueChanges, this.exactSearchControl.valueChanges]).pipe(
      debounceTime(500),
      switchMap(([searchStr, exact]) => {
        return this.catalogResource.searchAutocomplete(searchStr, exact);
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

  ngOnDestroy() {
    this.onDestroy$.next(undefined);
    this.onDestroy$.complete();
  }
}
