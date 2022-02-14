import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of, withLatestFrom } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, timeout } from 'rxjs/operators';
import { CatalogActions, CategoriesActions, ProductActions } from './catalog.actions';
import { CatalogState } from './catalog.reducer';
import { CatalogResource } from './catalog.resource';
import { selectCurrentCatalog, selectSelectedContentType } from './catalog.selector';

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

  selectedCatalog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CatalogActions.selectCatalog),
        tap((action) => this.router.navigate([action.selectedCatalog, '', 'msg']))
      ),
    { dispatch: false }
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
          this.router.navigate([catalog, action.category.oid, contentType.toLocaleLowerCase()])
        )
      );
    },
    { dispatch: false }
  );

  getContent = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.getContent),
      switchMap((action) => {
        return combineLatest([this.catalogResource.getContent(action.category, action.contentType), of(action)]);
      }),
      map(([content, action]) => {
        return ProductActions.getContentSuccess({
          category: action.category,
          contentType: action.contentType,
          content,
        });
      })
    );
  });
}
