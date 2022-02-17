import { NestedTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { Category } from '../../store/catalog.reducer';
import { TreeNode } from './tree-datasource';

@Injectable({ providedIn: 'root' })
export class CategoryTreeControl extends NestedTreeControl<TreeNode<Category>> {
  override getChildren = (nodes: TreeNode<Category>) => nodes.children$;
}
