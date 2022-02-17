import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, of, withLatestFrom } from 'rxjs';
import { catchError, filter, first, map, mergeMap, switchMap, tap, timeout } from 'rxjs/operators';
import { selectRouteParam } from 'src/app/router/router.selector';
import { isDefined, parseNumber } from 'src/app/shared/helper';
import { CatalogActions, CategoriesActions, ProductActions, RoutingActions } from './catalog.actions';
import { CatalogState } from './catalog.reducer';
import { CatalogResource } from './catalog.resource';
import {
  selectCategories,
  selectCurrentCatalog,
  selectProductStatus,
  selectSelectedCategory,
  selectSelectedContentType,
} from './catalog.selector';

@Injectable({ providedIn: 'root' })
export class CatalogEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CatalogState>,
    private catalogResource: CatalogResource,
    private router: Router
  ) {}

  test$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      withLatestFrom(this.store.select(selectRouteParam('oid')), this.store.select(selectRouteParam('catalogId'))),
      first(),
      map(([_, oid, catalogId]) => {
        return RoutingActions.paramsFromRoute({ oid: parseNumber(oid), catalogId });
      })
    )
  );

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
      map(() => CategoriesActions.initTree())
    )
  );

  selectedCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.selectCatalog),
      tap(({ selectedCatalog }) => {
        this.router.navigate(['catalog', selectedCatalog]);
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

  setHierarchy$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.setTreeHierarchy),
      map(() => {
        return CategoriesActions.initTree();
      })
    );
  });

  loadSubCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.loadSubcategories),
      withLatestFrom(this.store.select(selectCategories)),
      mergeMap(([action, cats]) => {
        return this.catalogResource.getSubCategories(action.category, cats.hierarychy).pipe(
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

  selectCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.selectCategory),
      withLatestFrom(this.store.select(selectSelectedContentType), this.store.select(selectCurrentCatalog)),
      tap(([action, contentType, catalog]) =>
        this.router.navigate(['catalog', catalog, action.category.oid, contentType.toLocaleLowerCase()])
      ),
      map(([action, contentType, catalog]) => {
        return ProductActions.selectContent({ content: contentType });
      })
    );
  });

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

  getContentSucces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.getContentSuccess),
      withLatestFrom(this.store.select(selectCategories)),
      filter(([_, categories]) => {
        const hasSubcats = categories.list.some((c) => (c.children?.length ?? -1) > 0);
        return !hasSubcats;
      }),
      map(([action]) => {
        const oids = action.content.parents.map((cat) => cat.oid);
        return CategoriesActions.loadParentCategories({ oids });
      })
    );
  });

  loadParentCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.loadParentCategories),
      switchMap((action) => {
        return forkJoin([
          this.store.select(selectProductStatus).pipe(filter(isDefined), first()),
          this.store.select(selectCurrentCatalog).pipe(filter(isDefined), first()),
          this.store.select(selectCategories).pipe(filter(isDefined), first()),
          of(action.oids),
        ]);
      }),
      switchMap(([status, catalog, { hierarychy }, oids]) => {
        return combineLatest(
          oids.map((oid) => {
            return this.catalogResource.getSubCategories({ oid, cultureCode: catalog, status }, hierarychy);
          })
        );
      }),
      map((categories) => {
        return CategoriesActions.loadParentCategoriesSuccess({ categories });
      })
    );
  });

  selectContentType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.selectContent),
      switchMap((action) =>
        forkJoin([
          of(action.content),
          this.store.select(selectSelectedCategory).pipe(first()),
          this.store.select(selectCurrentCatalog).pipe(first()),
        ])
      ),
      map(([contentType, category, cultureCode]) => {
        return ProductActions.getContent({ contentType, oid: category!.oid, cultureCode: cultureCode! });
      })
    );
  });
}
