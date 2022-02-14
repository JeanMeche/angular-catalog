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
  exactSearchControl = new FormControl();

  onDestroy$ = new BehaviorSubject(undefined);

  vo$: Observable<{
    suggestions: Array<SearchAutocompleleteItem> | undefined;
  }>;

  constructor(private catalogResource: CatalogResource) {
    const searchResult$ = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchStr) => {
        return this.catalogResource.searchAutocomplete(searchStr, this.exactSearchControl.value);
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
