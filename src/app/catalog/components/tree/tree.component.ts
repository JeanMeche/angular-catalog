import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTree } from '@angular/material/tree';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith, takeUntil, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base-component.directive';
import { CategoriesActions, ProductActions } from '../../store/catalog.actions';
import { CatalogState, Category, Product } from '../../store/catalog.reducer';
import { selectCategoriesAndSelected } from '../../store/catalog.selector';
import { DynamicDataSource, TreeNode } from './tree-datasource';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent extends BaseComponent {
  treeControl = new NestedTreeControl<TreeNode<Category>>((node) => node.children$);
  dataSource = new DynamicDataSource(this.store, this.treeControl, this.actions$);

  vo$: Observable<{ selectedCategory?: number; isLoading: boolean }>;

  constructor(private readonly store: Store<CatalogState>, private actions$: Actions) {
    super()
    this.vo$ = this.store.select(selectCategoriesAndSelected).pipe(
      map(({ current, categories }) => {
        return {
          isLoading: categories.isLoading,
          selectedCategory: current?.oid,
        };
      })
    );

    this.actions$
      .pipe(ofType(CategoriesActions.loadParentCategoriesSuccess), takeUntil(this.destroyed$))
      .subscribe((action) => {
        this.dataSource.addCategories(action.categories);
      });
  }

  hasChild(_: number, node: TreeNode<Category | Product>): boolean {
    return 'isProduct' in node.value && !node.value.isProduct;
  }

  trackBy(_: number, node: TreeNode<Category>): string {
    return `${node.value.oid}`;
  }

  isAllCollapsed(): boolean {
    return this.treeControl.expansionModel.selected.filter((node) => node.value.level === 1).length == 0;
  }

  selectCategory($event: MouseEvent, category: Category, isExpanded: boolean): void {
    if (isExpanded) {
      $event.stopPropagation();
    }
    this.store.dispatch(ProductActions.selectCategory({ category }));
  }
}
