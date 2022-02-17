import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base-component.directive';
import { ProductActions } from '../../store/catalog.actions';
import { CatalogState, ContentType, ProductStatus } from '../../store/catalog.reducer';
import { selectStatusAndContentType } from '../../store/catalog.selector';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
})
export class ProductContentComponent extends BaseComponent {
  vo$: Observable<{
    productStatus: Set<ProductStatus>;
    contentType: ContentType;
  }>;
  statusControl = new FormControl();

  contentTypesLinks: Array<{ label: string; value: ContentType }> = [
    { label: 'Messaging', value: 'MSG' },
    { label: 'TechSpec', value: 'TSP' },
    { label: 'Compatibilities', value: 'LOG' },
    { label: 'Documents', value: 'DOC' },
    { label: 'Images', value: 'IMG' },
    { label: 'Videos', value: 'VID' },
    { label: 'Ratings', value: 'RAT' },
    { label: 'PLC', value: 'MDA' },
  ];

  constructor(private readonly store: Store<CatalogState>, private readonly route: ActivatedRoute) {
    super();

    this.statusControl.valueChanges.subscribe((status: Array<ProductStatus>) => {
      this.store.dispatch(ProductActions.selectProductStatus({ status: new Set(status) }));
    });

    this.vo$ = this.store.select(selectStatusAndContentType).pipe(
      tap(({ productStatus }) =>
        this.statusControl.patchValue(Array.from(productStatus), {
          emitEvent: false,
        })
      ),
      map(({ productStatus, contentType }) => ({
        productStatus,
        contentType,
      }))
    );

    this.store.dispatch(ProductActions.selectContent({ content: 'MSG' }));
  }

  selectContentType(contentType: ContentType): void {
    this.store.dispatch(ProductActions.selectContent({ content: contentType }));
  }
}
