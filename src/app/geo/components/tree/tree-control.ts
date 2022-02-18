import { NestedTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { GeoTypes } from '../../store/geo.reducer';
import { TreeNode } from './tree-datasource';

@Injectable({ providedIn: 'root' })
export class GeoTreeControl extends NestedTreeControl<TreeNode<GeoTypes>> {
  constructor() {
    super((node) => node.children$);
  }
}
