import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  concatMap,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base-component.directive';
import { ProductActions } from '../../store/catalog.actions';
import { CatalogState, ContentType, ProductStatus } from '../../store/catalog.reducer';
import {
  selectCurrentCatalog,
  selectProductStatus,
  selectSelectedContentType,
  selectStatusAndContentType,
} from '../../store/catalog.selector';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
})
export class ProductContentComponent extends BaseComponent {
  vo$: Observable<{
    productStatus: Set<ProductStatus>;
    contentType: ContentType;
  }>;
  statusControl = new FormControl();

  constructor(private readonly store: Store<CatalogState>, private readonly route: ActivatedRoute) {
    super();

    this.statusControl.valueChanges.subscribe((status: Array<ProductStatus>) => {
      this.store.dispatch(ProductActions.selectProductStatus({ status: new Set(status) }));
    });

    this.vo$ = this.store.select(selectStatusAndContentType).pipe(
      tap(({ productStatus }) =>
        this.statusControl.patchValue(Array.from(productStatus), {
          emitEvent: false,
        })
      ),
      map(({ productStatus, contentType }) => ({
        productStatus,
        contentType,
      }))
    );
  }
}
