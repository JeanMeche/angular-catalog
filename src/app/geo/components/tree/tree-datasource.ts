import { CollectionViewer } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Injectable, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  filter,
  first,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { GeoActions } from '../../store/geo.action';
import { GeoState, GeoTypes } from '../../store/geo.reducer';
import { selectRegions } from '../../store/geo.selector';
import { GeoTreeControl } from './tree-control';

@Injectable({ providedIn: 'root' })
export class DynamicDataSource extends MatTreeNestedDataSource<TreeNode<GeoTypes>> implements OnDestroy {
  private onDestroyed$ = new Subject();

  constructor(private store: Store<GeoState>, private treeControl: GeoTreeControl, private actions$: Actions) {
    super();
    this.store.dispatch(GeoActions.loadRegions());

    this.treeControl.expansionModel.changed
      .pipe(
        takeUntil(this.onDestroyed$),
        filter((change) => change.added && change.added.length > 0),
        map((change) => change.added[0]),
        tap((changedCategoryNode) => {
          if (changedCategoryNode.children.length === 0) {
            changedCategoryNode.isLoading();
            this.store.dispatch(
              GeoActions.loadGeo({
                geo: changedCategoryNode.value,
              })
            );
          }
        }),
        switchMap((changedCategoryNode) =>
          combineLatest([of(changedCategoryNode), this.actions$.pipe(ofType(GeoActions.loadGeoSuccess))])
        ),
      )
      .subscribe(([changedCategoryNode, geo]) => {
        console.log(geo);
        changedCategoryNode.addchildren(geo.geos.map(this.toNode));
      });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.complete();
  }

  override connect(collectionViewer: CollectionViewer): Observable<Array<TreeNode<GeoTypes>>> {
    return this.store.select(selectRegions).pipe(
      filter((arr) => arr.length > 0),
      first(),
      map((r) => r.map((c) => this.toNode(c))),
      tap((nodes) => {
        this.treeControl.dataNodes = nodes;
      })
    );
  }

  toNode(geo: GeoTypes): TreeNode<GeoTypes> {
    if (geo.type === 'Region') {
      return new TreeNode(
        geo,
        geo.departements?.map((cat) => this.toNode(cat))
      );
    } else if (geo.type === 'Departement') {
      return new TreeNode(
        geo,
        geo.communes?.map((cat) => this.toNode(cat))
      );
    } else {
      return new TreeNode<GeoTypes>(geo);
    }
  }
}

export class TreeNode<T extends GeoTypes> {
  children$: BehaviorSubject<TreeNode<T>[]> = new BehaviorSubject<TreeNode<T>[]>(this.children);

  constructor(public value: T, public children: Array<TreeNode<T>> = []) {}

  isLoading(bool: boolean = true) {
    this.value = { ...this.value, isLoading: bool };
    this.children$.next([]);
  }

  addchildren(nodes: TreeNode<T>[]) {
    this.children = this.children.concat(this.children, nodes);
    this.value = { ...this.value, isLoading: false };
    this.children$.next(this.children);
  }
}
