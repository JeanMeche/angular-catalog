import { CollectionViewer } from '@angular/cdk/collections';
import { Injectable, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, first, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { CategoriesActions } from '../../store/catalog.actions';
import { CatalogState, Category } from '../../store/catalog.reducer';
import { selectCategories } from '../../store/catalog.selector';
import { CategoryTreeControl } from './tree-control';

@Injectable({ providedIn: 'root' })
export class DynamicDataSource extends MatTreeNestedDataSource<TreeNode<Category>> implements OnDestroy {
  private onDestroyed$ = new Subject();

  constructor(private store: Store<CatalogState>, private treeControl: CategoryTreeControl, private actions$: Actions) {
    super();

    this.actions$
      .pipe(ofType(CategoriesActions.loadParentCategoriesSuccess))
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((action) => {
        this.addCategories(action.categories);
      });

    this.treeControl.expansionModel.changed.subscribe((change) => {
      if (change.added && change.added.length > 0) {
        const changedCategoryNode = change.added[0];
        this.subscribeLoadSubcategoriesUpdate(changedCategoryNode);

        if (changedCategoryNode.children.length === 0) {
          changedCategoryNode.isLoading();
          this.store.dispatch(
            CategoriesActions.loadSubcategories({
              category: changedCategoryNode.value,
            })
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.complete();
  }

  override connect(collectionViewer: CollectionViewer): Observable<Array<TreeNode<Category>>> {
    return this.store
      .select(selectCategories)
      .pipe(first())
      .pipe(
        map((cats) => cats.list.map((c) => this.toNode(c))),
        tap((nodes) => {
          this.treeControl.dataNodes = nodes;
        })
      );
  }

  addCategories(
    categories: Array<{ oid: number; children: Array<Category> }>,
    nodes: Array<TreeNode<Category>> = this.treeControl.dataNodes
  ) {
    if (categories.length > 0) {
      const [firstCat, ...rest] = categories;
      const node = nodes.find((n) => n.value.oid === firstCat.oid);
      if (node) {
        const childNodes = firstCat.children.map(this.toNode);
        node.addchildren(childNodes);
        this.treeControl.expansionModel.toggle(node);
        this.addCategories(rest, childNodes);
      }
    }
  }

  private toNode(category: Category): TreeNode<Category> {
    return new TreeNode(
      category,
      category.children?.map((cat) => this.toNode(cat))
    );
  }

  private subscribeLoadSubcategoriesUpdate(changedCategoryNode: TreeNode<Category>) {
    this.actions$
      .pipe(
        takeUntil(this.onDestroyed$),
        ofType(CategoriesActions.loadSubcategoriesSuccess),
        filter((action) => action.oid === changedCategoryNode.value.oid),
        take(1)
      )
      .subscribe(({ newCategories }) => changedCategoryNode.addchildren(newCategories.map(this.toNode)));

    this.actions$
      .pipe(
        takeUntil(this.onDestroyed$),
        ofType(CategoriesActions.loadSubcategoriesError),
        filter((action) => action.oid === changedCategoryNode.value.oid),
        take(1)
      )
      .subscribe(() => {
        changedCategoryNode.isLoading(false);
      });
  }
}

export class TreeNode<T> {
  children$: BehaviorSubject<TreeNode<T>[]> = new BehaviorSubject(this.children);

  constructor(public value: T, public children: Array<TreeNode<T>> = []) {}

  isLoading(bool: boolean = true) {
    this.value = { ...this.value, isLoading: bool };
    this.children$.next([]);
  }

  addchildren(nodes: TreeNode<T>[]) {
    this.value = { ...this.value, isLoading: false };

    this.children = this.children.concat(this.children, nodes);
    this.children$.next(this.children);
  }
}
