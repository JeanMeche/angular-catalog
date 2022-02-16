import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { delay, map, Observable, startWith } from 'rxjs';
import { CatalogActions } from '../../store/catalog.actions';
import { Catalog, CatalogState } from '../../store/catalog.reducer';
import { selectCatalogsAndCurrent } from '../../store/catalog.selector';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss'],
})
export class CatalogListComponent implements OnInit {
  vo$: Observable<{
    catalogs: Array<Catalog>;
    selectedCatalog?: Catalog;
    isLoading: boolean;
  }>;

  constructor(private readonly store: Store<CatalogState>) {
    this.vo$ = this.store.select(selectCatalogsAndCurrent).pipe(
      map(({ catalogs, current }) => {
        const selectedCatalog = catalogs.find((c) => c.code === current);
        if (selectedCatalog) {
          return {
            catalogs,
            selectedCatalog,
            isLoading: false,
          };
        }

        return {
          catalogs: [],
          isLoading: true,
        };
      }),
      startWith({
        catalogs: [],
        isLoading: true,
      })
    );
  }

  catalogSelected(selection: MatSelectChange): void {
    this.store.dispatch(CatalogActions.selectCatalog({ selectedCatalog: selection.value }));
  }

  ngOnInit() {}
}
