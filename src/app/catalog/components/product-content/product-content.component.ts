import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, switchMap, take, withLatestFrom } from 'rxjs';
import { ProductActions } from '../../store/catalog.actions';
import { BaseCategory, CatalogState, Category, ContentType, ProductStatus } from '../../store/catalog.reducer';
import { selectCatagory, selectProductStatus, selectSelectedContentType } from '../../store/catalog.selector';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
})
export class ProductContentComponent {
  vo$: Observable<{
    productStatus: Set<ProductStatus>;
    contentType: ContentType;
  }>;

  constructor(private readonly store: Store<CatalogState>, private readonly route: ActivatedRoute) {
    route.paramMap
      .pipe(
        map((params) => {
          const oid = params.get('oid');
          return oid ? +oid : undefined;
        }),
        filter((oid): oid is number => oid !== undefined),
        switchMap((oid) => this.store.select(selectCatagory(oid)).pipe(take(1))),
        filter((cat): cat is Category => cat !== undefined),
        withLatestFrom(this.store.select(selectSelectedContentType))
      )
      .subscribe(([category, contentType]) => {
        this.store.dispatch(ProductActions.getContent({ contentType: contentType, category: category }));
      });

    this.vo$ = combineLatest([
      this.store.select(selectProductStatus),
      this.store.select(selectSelectedContentType),
    ]).pipe(
      map(([productStatus, contentType]) => ({
        productStatus,
        contentType,
      }))
    );
  }

  statusSelected(status: Array<ProductStatus>) {
    this.store.dispatch(ProductActions.selectProductStatus({ status: new Set(status) }));
  }
}
