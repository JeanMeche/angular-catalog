import { CollectionViewer } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, map, Observable, take, tap } from 'rxjs';
import { CategoriesActions } from '../../store/catalog.actions';
import { CatalogState, Category } from '../../store/catalog.reducer';
import { selectCategories } from '../../store/catalog.selector';

export class DynamicDataSource extends MatTreeNestedDataSource<TreeNode<Category>> {
  dataChange = new BehaviorSubject<TreeNode<Category>[]>([]);

  constructor(
    private store: Store<CatalogState>,
    private treeControl: NestedTreeControl<TreeNode<Category>>,
    private actions$: Actions
  ) {
    super();
    this.store.dispatch(CategoriesActions.initTree());
    this.treeControl.expansionModel.changed.subscribe((change) => {
      if (change.added && change.added.length > 0) {
        const changedCategoryNode = change.added[0];
        this.actions$
          .pipe(
            ofType(CategoriesActions.loadSubcategoriesSuccess),
            filter((action) => action.oid === changedCategoryNode.value.oid),
            take(1)
          )
          .subscribe(({ newCategories }) => changedCategoryNode.addchildren(newCategories.map(this.toNode)));

        this.actions$
          .pipe(
            ofType(CategoriesActions.loadSubcategoriesError),
            filter((action) => action.oid === changedCategoryNode.value.oid),
            take(1)
          )
          .subscribe(() => {
            changedCategoryNode.isLoading(false);
          });
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

  override connect(collectionViewer: CollectionViewer): Observable<Array<TreeNode<Category>>> {
    return this.store.select(selectCategories).pipe(
      map((cats) => cats.list.map((c) => this.toNode(c))),
      tap((nodes) => {
        this.treeControl.dataNodes = nodes;
      })
    );
  }

  toNode(category: Category): TreeNode<Category> {
    return new TreeNode(
      category,
      category.children?.map((cat) => this.toNode(cat))
    );
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
