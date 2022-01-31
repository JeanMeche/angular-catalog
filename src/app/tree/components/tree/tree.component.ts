import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TreeState } from '../../store/tree.reducer';
import { Category } from '../../store/tree.state';
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

  constructor(private readonly store: Store<TreeState>, private actions$: Actions) {}

  hasChild(_: number, node: TreeNode<Category>): boolean {
    return node.value.type === 'category';
  }

  trackBy(_: number, node: TreeNode<Category>): string {
    return node.value.id;
  }
}
