import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base-component.directive';
import { CategoriesActions, ProductActions } from '../../store/catalog.actions';
import { CatalogState, Category, Product } from '../../store/catalog.reducer';
import { selectCategoriesAndSelected } from '../../store/catalog.selector';
import { CategoryTreeControl } from './tree-control';
import { DynamicDataSource, TreeNode } from './tree-datasource';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent extends BaseComponent {
  vo$: Observable<{ selectedCategory?: number; isLoading: boolean; hierarchy: 'Q' | 'F' }>;

  constructor(
    private readonly store: Store<CatalogState>,
    public dataSource: DynamicDataSource,
    public treeControl: CategoryTreeControl
  ) {
    super();
    this.vo$ = this.store.select(selectCategoriesAndSelected).pipe(
      map(({ current, categories }) => {
        return {
          isLoading: categories.isLoading,
          selectedCategory: current?.oid,
          hierarchy: categories.hierarychy,
        };
      })
    );
  }

  isExpanded = (node: TreeNode<any>) => {};

  hasChild(_: number, node: TreeNode<Category | Product>): boolean {
    return 'isProduct' in node.value && !node.value.isProduct;
  }

  trackBy(_: number, node: TreeNode<Category>): string {
    return `${node.value.oid}`;
  }

  isAllCollapsed(): boolean {
    return this.treeControl.expansionModel.selected.filter((node) => node.value.level === 1).length == 0;
  }

  selectCategory($event: MouseEvent, category: Category, isExpanded: boolean = false): void {
    if (isExpanded) {
      $event.stopPropagation();
    }
    this.store.dispatch(ProductActions.selectCategory({ category }));
  }

  selectHierarchy(hierarchy: 'Q' | 'F') {
    this.store.dispatch(CategoriesActions.setTreeHierarchy({ hierarchy }));
  }
}
