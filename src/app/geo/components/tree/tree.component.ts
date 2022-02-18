import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base.component';
import { GeoActions } from '../../store/geo.action';
import { Commune, GeoState, GeoTypes, Region } from '../../store/geo.reducer';
import { selectFeature, selectRegions } from '../../store/geo.selector';
import { GeoTreeControl } from './tree-control';
import { DynamicDataSource, TreeNode } from './tree-datasource';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent extends BaseComponent {
  vo$: Observable<{ isLoading: boolean; selectedGeo?: string }>;

  constructor(
    private readonly store: Store<GeoState>,
    public dataSource: DynamicDataSource,
    public treeControl: GeoTreeControl
  ) {
    super();
    this.vo$ = this.store.select(selectFeature).pipe(
      map((state) => {
        return {
          isLoading: state.isLoading,
          selectedGeo: state.selectedGeo,
        };
      })
    );
  }

  hasChild(_: number, node: TreeNode<GeoTypes>): boolean {
    return node.value.type === 'Region' || node.value.type === 'Departement';
  }

  trackBy(_: number, node: TreeNode<GeoTypes>): string {
    return `${node.value.id}`;
  }

  isAllCollapsed(): boolean {
    return !this.treeControl.expansionModel.selected.some((node) => node.value.type === 'Region');
  }

  selectGeo($event: MouseEvent, geo: GeoTypes, isExpanded: boolean = false): void {
    if (isExpanded) {
      $event.stopPropagation();
    }
    this.store.dispatch(GeoActions.selectGeo({ geo }));
  }

  selectCommune($event: MouseEvent, commune: Commune, isExpanded: boolean = false): void {
    if (isExpanded) {
      $event.stopPropagation();
    }
    this.store.dispatch(GeoActions.selectCommune({ commune }));
  }
}
