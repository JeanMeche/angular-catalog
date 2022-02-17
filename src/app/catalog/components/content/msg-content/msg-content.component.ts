import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { CatalogState, Content } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContentByType } from 'src/app/catalog/store/catalog.selector';
import { isDefined } from 'src/app/shared/helper';

// interface MsgContent {
//   oid: number;
//   productNumber?: string;
//   productName: string;
//   others: Array<{ key: string; value: string }>;
//   parents: Array<BaseCategory>;
// }

@Component({
  selector: 'app-msg-content',
  templateUrl: './msg-content.component.html',
  styleUrls: ['./msg-content.component.scss'],
})
export class MsgContentComponent {
  vo$: Observable<{ content?: Content; isLoading: boolean }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectProductContentByType('MSG')).pipe(
      filter(isDefined),
      map(({ items, isLoading }): { isLoading: boolean; content?: Content } => {
        return {
          isLoading,
          content: items,
        };
      })
    );
  }
}
