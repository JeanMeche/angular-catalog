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
import { selectCurrentCatalog, selectProductStatus, selectSelectedContentType } from '../../store/catalog.selector';

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
    route.paramMap
      .pipe(
        takeUntil(this.destroyed),
        map((params) => {
          const oid = params.get('oid');
          return oid ? +oid : undefined;
        }),
        filter((oid): oid is number => oid !== undefined),
        tap(console.log),
        switchMap((oid) =>
          forkJoin([
            of(oid),
            this.store.select(selectCurrentCatalog).pipe(
              filter((c): c is string => c !== undefined),
              take(1)
            ),
            this.store.select(selectSelectedContentType).pipe(take(1)),
          ])
        )
      )
      .subscribe({
        next: ([oid, currentCatalog, contentType]) => {
          this.store.dispatch(ProductActions.getContent({ contentType, oid, cultureCode: currentCatalog }));
        },
        error: console.error,
        complete: console.log,
      });

    this.statusControl.valueChanges.subscribe((status: Array<ProductStatus>) => {
      this.store.dispatch(ProductActions.selectProductStatus({ status: new Set(status) }));
    });

    this.vo$ = combineLatest([
      this.store.select(selectProductStatus),
      this.store.select(selectSelectedContentType),
    ]).pipe(
      tap(([status]) =>
        this.statusControl.patchValue(Array.from(status), {
          emitEvent: false,
        })
      ),
      map(([productStatus, contentType]) => ({
        productStatus,
        contentType,
      }))
    );
  }
}
