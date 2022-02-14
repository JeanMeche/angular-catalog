import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { ProductActions } from '../../store/catalog.actions';
import { CatalogState, Category, Product } from '../../store/catalog.reducer';
import { selectCategories, selectSelectedCategory } from '../../store/catalog.selector';
import { DynamicDataSource, TreeNode } from './tree-datasource';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  treeControl = new NestedTreeControl<TreeNode<Category>>((node) => node.children$);
  dataSource = new DynamicDataSource(this.store, this.treeControl, this.actions$);

  vo$: Observable<{ selectedCategory?: number; isLoading: boolean }>;

  constructor(private readonly store: Store<CatalogState>, private actions$: Actions) {
    this.vo$ = combineLatest([this.store.select(selectSelectedCategory), this.store.select(selectCategories)]).pipe(
      map(([selectedCategory, categories]) => {
        return {
          isLoading: categories.isLoading,
          selectedCategory: selectedCategory?.oid,
        };
      }),
      startWith({ isLoading: true })
    );
  }

  hasChild(_: number, node: TreeNode<Category | Product>): boolean {
    return !('isProduct' in node);
  }

  trackBy(_: number, node: TreeNode<Category>): string {
    return `${node.value.oid}`;
  }

  isAllCollapsed(): boolean {
    return this.treeControl.expansionModel.selected.filter((node) => node.value.level === 1).length == 0;
  }

  selectCategory(category: Category): void {
    this.store.dispatch(ProductActions.selectCategory({ category }));
  }
}
