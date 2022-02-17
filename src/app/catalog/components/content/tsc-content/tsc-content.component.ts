import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { CatalogState, Content } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContentByType } from 'src/app/catalog/store/catalog.selector';
import { isDefined } from 'src/app/shared/helper';

@Component({
  selector: 'app-tsp-content',
  templateUrl: './tsc-content.component.html',
  styleUrls: ['./tsc-content.component.scss'],
})
export class TspContentComponent {
  vo$: Observable<{ content?: Content; isLoading: boolean }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectProductContentByType('TSP')).pipe(
      filter(isDefined),
      tap(console.log),
      map(({ isLoading, items }): { content?: Content; isLoading: boolean } => {
        return {
          isLoading,
          content: items,
        };
      })
    );
  }
}
