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
  constructor(
    private store: Store<CatalogState>,
    private treeControl: NestedTreeControl<TreeNode<Category>>,
    private actions$: Actions
  ) {
    super();
    this.treeControl.expansionModel.changed.subscribe((change) => {
      console.log('exp');
      if (change.added && change.added.length > 0) {
        const changedCategoryNode = change.added[0];
        console.log(changedCategoryNode);

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
        console.log('connect', nodes);
      })
    );
  }

  addCategories(categories: Array<{ oid: number; children: Array<Category> }>) {
    const nodes = this.flatten(this.treeControl.dataNodes);
    categories.forEach((cat) => {
      const node = nodes.find((n) => n.value.oid === cat.oid);
      // console.log(node, node?.value.label);
      node!.addchildren(cat.children.map(this.toNode));
    });
    this.treeControl.expansionModel.toggle(nodes[0]);
    console.log('update');
    //.select(nodes[0]);
    console.log(this.treeControl.expansionModel);
  }

  private toNode(category: Category): TreeNode<Category> {
    return new TreeNode(
      category,
      category.children?.map((cat) => this.toNode(cat))
    );
  }

  private flatten = (nodes: Array<TreeNode<Category>>): Array<TreeNode<Category>> => {
    return nodes.flatMap((node) => [node, ...(node.children ? this.flatten(node.children) : [])]);
  };
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
