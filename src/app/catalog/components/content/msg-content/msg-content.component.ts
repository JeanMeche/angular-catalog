import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { BaseCategory, CatalogState, Content } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContent, selectProductContentByType } from 'src/app/catalog/store/catalog.selector';

interface MsgContent {
  oid: number;
  productNumber?: string;
  productName: string;
  others: Array<{ key: string; value: string }>;
  parents: Array<BaseCategory>;
}

@Component({
  selector: 'app-msg-content',
  templateUrl: './msg-content.component.html',
  styleUrls: ['./msg-content.component.scss'],
})
export class MsgContentComponent {
  vo$: Observable<{ content: MsgContent }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectProductContentByType('MSG')).pipe(
      filter((content): content is Content & {} => content !== undefined),
      map((content): { content: MsgContent } => {
        return {
          content,
        };
      })
    );
  }
}
