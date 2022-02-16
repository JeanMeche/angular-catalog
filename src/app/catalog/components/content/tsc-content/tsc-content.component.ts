import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { BaseCategory, CatalogState, Content, LoadableContent } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContentByType } from 'src/app/catalog/store/catalog.selector';
import { isDefined } from 'src/app/shared/helper';

interface TscContent {
  oid: number;
  productNumber?: string;
  productName: string;
  others: Array<{ key: string; value: string }>;
  parents: Array<BaseCategory>;
}

@Component({
  selector: 'app-tsc-content',
  templateUrl: './tsc-content.component.html',
  styleUrls: ['./tsc-content.component.scss'],
})
export class TscContentComponent {
  vo$: Observable<{ content?: TscContent; isLoading: boolean }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectProductContentByType('TSP')).pipe(
      filter(isDefined),
      map(({ isLoading, items }): { content?: TscContent; isLoading: boolean } => {
        return {
          isLoading,
          content: items,
        };
      })
    );
  }
}
