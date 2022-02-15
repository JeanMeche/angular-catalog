import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, of, withLatestFrom } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap, timeout } from 'rxjs/operators';
import {
  selectRouteParams,
  selectCurrentRoute,
  selectQueryParams,
  selectRouteParam,
} from 'src/app/router/router.selector';
import { CatalogActions, CategoriesActions, ProductActions } from './catalog.actions';
import { CatalogState, Content, ContentType } from './catalog.reducer';
import { CatalogResource } from './catalog.resource';
import { selectCurrentCatalog, selectSelectedCategory, selectSelectedContentType } from './catalog.selector';

@Injectable({ providedIn: 'root' })
export class CatalogEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CatalogState>,
    private catalogResource: CatalogResource,
    private router: Router
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.init),
      switchMap(() => this.catalogResource.getCatalogs()),
      map((catalogs) => CatalogActions.initSuccess({ catalogs }))
    )
  );

  initSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.initSuccess),
      map((action) => CatalogActions.selectCatalog({ selectedCatalog: action.catalogs[0].code }))
    )
  );

  selectedCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.selectCatalog),
      withLatestFrom(this.store.select(selectSelectedCategory)),
      tap(([action, cat]) => {
        if (cat) {
          this.router.navigate(['catalog', action.selectedCatalog, cat.oid, 'msg']);
          // this.router.navigate(['catalog', action.selectedCatalog]);
        }
      }),
      map(() => CategoriesActions.initTree())
    )
  );

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.initTree),
      switchMap(() => {
        return this.catalogResource.getCategories();
      }),
      map((categories) => {
        return CategoriesActions.initTreeSuccess({ categories });
      })
    );
  });

  loadSubCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.loadSubcategories),
      mergeMap((action) => {
        return this.catalogResource.getSubCategories(action.category).pipe(
          timeout(10000),
          map((result) => {
            return CategoriesActions.loadSubcategoriesSuccess({
              oid: result.oid,
              newCategories: result.children,
            });
          }),
          catchError(() => {
            return of(
              CategoriesActions.loadSubcategoriesError({
                oid: action.category.oid,
              })
            );
          })
        );
      })
    );
  });

  selectCategory$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductActions.selectCategory),
        withLatestFrom(this.store.select(selectSelectedContentType), this.store.select(selectCurrentCatalog)),
        tap(([action, contentType, catalog]) =>
          this.router.navigate(['catalog', catalog, action.category.oid, contentType.toLocaleLowerCase()])
        )
      );
    },
    { dispatch: false }
  );

  getContent = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.getContent),
      switchMap((action) => {
        return combineLatest([
          this.catalogResource.getContent(action.oid, action.cultureCode, action.contentType),
          of(action),
        ]);
      }),
      map(([content, action]) => {
        return ProductActions.getContentSuccess({
          oid: action.oid,
          contentType: action.contentType,
          content,
        });
      })
    );
  });

  onProductContentRouteChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigationAction),
      switchMap(() =>
        forkJoin([
          this.store.select(selectRouteParam('catalogId')).pipe(take(1)),
          this.store.select(selectRouteParam('oid')).pipe(
            take(1),
            map((v) => +(v ?? 0))
          ),
          this.store.select(selectRouteParam('content')).pipe(
            take(1),
            map((c) => c?.toLocaleUpperCase())
          ),
        ])
      ),
      map(([cultureCode, oid, content]) => {
        return ProductActions.getContent({ contentType: content as ContentType, oid, cultureCode: cultureCode! });
      })
    );
  });
}
