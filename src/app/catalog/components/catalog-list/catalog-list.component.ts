import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { CatalogActions } from '../../store/catalog.actions';
import { Catalog, CatalogState } from '../../store/catalog.reducer';
import { selectCatalogs, selectCurrentCatalog } from '../../store/catalog.selector';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss'],
})
export class CatalogListComponent implements OnInit {
  vo$: Observable<{
    catalogs: Array<Catalog>;
    selectedCatalog: Catalog;
  }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = combineLatest([this.store.select(selectCatalogs), this.store.select(selectCurrentCatalog)]).pipe(
      map(([catalogs, current]) => {
        return {
          catalogs,
          selectedCatalog: catalogs.find((c) => c.code === current)!,
        };
      })
    );
  }

  catalogSelected(selection: MatSelectChange): void {
    this.store.dispatch(CatalogActions.selectCatalog({ selectedCatalog: selection.value }));
  }

  ngOnInit() {}
}
