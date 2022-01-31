import { CollectionViewer } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { TreeActions } from '../../store/tree.action';
import { TreeState } from '../../store/tree.reducer';
import { selectCategories } from '../../store/tree.selector';
import { Category } from '../../store/tree.state';

export class DynamicDataSource extends MatTreeNestedDataSource<
  TreeNode<Category>
> {
  dataChange = new BehaviorSubject<TreeNode<Category>[]>([]);

  override get data(): TreeNode<Category>[] {
    return this.dataChange.value;
  }
  override set data(value: TreeNode<Category>[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private store: Store<TreeState>,
    private treeControl: NestedTreeControl<TreeNode<Category>>,
    private actions$: Actions
  ) {
    super();
    this.store.dispatch(TreeActions.initTree());
  }

  override connect(
    collectionViewer: CollectionViewer
  ): Observable<Array<TreeNode<Category>>> {
    this.treeControl.expansionModel.changed.subscribe((change) => {
      if (change.added && change.added.length > 0) {
        const changedCategory = change.added[0];
        this.actions$
          .pipe(
            ofType(TreeActions.loadSubcategoriesSuccess),
            filter((action) => action.categoryId === changedCategory.value.id),
            take(1)
          )
          .subscribe(({ categoryId, newCategories }) => {
            changedCategory.addchildren(newCategories.map(this.toNode));
          });
        if (changedCategory.children.length === 0) {
          this.store.dispatch(
            TreeActions.loadSubcategories({
              categoryId: changedCategory.value.id,
            })
          );
        }
      }
    });
    return this.store.select(selectCategories).pipe(
      take(1),
      map((cats) => cats.map((c) => this.toNode(c)))
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
  children$: BehaviorSubject<TreeNode<T>[]> = new BehaviorSubject<
    TreeNode<T>[]
  >(this.children);

  constructor(public value: T, public children: Array<TreeNode<T>> = []) {}

  addchildren(nodes: TreeNode<T>[]) {
    this.children = this.children.concat(this.children, nodes);
    this.children$.next(this.children);
  }
}
