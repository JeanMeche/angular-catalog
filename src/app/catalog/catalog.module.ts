import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { CatalogComponent } from './catalog.component';
import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { ExternalAccessComponent } from './components/content/external-access/external-access.component';
import { MsgContentComponent } from './components/content/msg-content/msg-content.component';
import { ParentTreeComponent } from './components/content/parent-tree/parent-tree.component';
import { TspContentComponent } from './components/content/tsc-content/tsc-content.component';
import { ProductContentComponent } from './components/product-content/product-content.component';
import { SearchComponent } from './components/search/search.component';
import { TreeComponent } from './components/tree/tree.component';
import { CatalogEffects } from './store/catalog.effects';
import { featureKey, reducer } from './store/catalog.reducer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([CatalogEffects]),

    /** CDK/Material modules  */
    DragDropModule,
    OverlayModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,

    /** Local modules */
    SharedModule,
  ],
  declarations: [
    CatalogComponent,
    SearchComponent,
    CatalogListComponent,
    TreeComponent,
    ParentTreeComponent,
    ProductContentComponent,
    ExternalAccessComponent,

    MsgContentComponent,
    TspContentComponent,
  ],
})
export class CatalogModule {}
