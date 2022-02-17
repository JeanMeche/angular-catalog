import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { CatalogState, ContentType } from 'src/app/catalog/store/catalog.reducer';
import { selectProductContent } from 'src/app/catalog/store/catalog.selector';

@Component({
  selector: 'app-external-access',
  templateUrl: './external-access.component.html',
  styleUrls: ['./external-access.component.scss'],
})
export class ExternalAccessComponent {
  @Input() contentType!: ContentType;

  vo$: Observable<{ level: number }>;

  constructor(private store: Store<CatalogState>) {
    this.vo$ = store.select(selectProductContent).pipe(
      map((content) => {
        return {
          level: content?.[this.contentType]?.items?.level ?? 0,
        };
      })
    );
  }

  goToAssetHub(): void {}
}
