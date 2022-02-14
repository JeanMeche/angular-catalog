import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CatalogActions } from './catalog/store/catalog.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'poc-catalog';

  constructor(private readonly store: Store<any>) {
    this.store.dispatch(CatalogActions.init());
  }
}
