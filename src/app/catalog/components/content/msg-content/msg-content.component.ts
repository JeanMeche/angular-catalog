import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { CatalogState, Content } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContent } from 'src/app/catalog/store/catalog.selector';

interface MsgContent {
  oid: number;
  productNumber?: string;
  productName: string;
  others: Array<{ key: string; value: string }>;
}

@Component({
  selector: 'app-msg-content',
  templateUrl: './msg-content.component.html',
  styleUrls: ['./msg-content.component.scss'],
})
export class MsgContentComponent {
  vo$: Observable<{ content: MsgContent }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectProductContent('MSG')).pipe(
      filter((content): content is Content['MSG'] & {} => content !== undefined),
      map((content): { content: MsgContent } => {
        return {
          content: {
            oid: content.oid,
            productNumber: content.productNumber,
            productName: content.productName,
            others: content.others,
          },
        };
      })
    );
  }
}
