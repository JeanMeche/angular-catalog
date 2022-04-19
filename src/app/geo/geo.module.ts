import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ApiModule } from './api';
import { CardComponent } from './components/card/card.component';
import { CommuneDetailComponent } from './components/commune-detail/commune-detail.component';
import { GeoComponent } from './components/geo/geo.component';
import { GeolocComponent } from './components/geoloc/geoloc.component';
import { SearchComponent } from './components/search/search.component';
import { TreeComponent } from './components/tree/tree.component';
import { TreeEffects } from './store/geo.effects';
import { featureKey, geoReducer } from './store/geo.reducer';

@NgModule({
  declarations: [GeoComponent, TreeComponent, CardComponent, CommuneDetailComponent, GeolocComponent, SearchComponent],
  exports: [],
  imports: [
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    StoreModule.forFeature(featureKey, geoReducer),
    EffectsModule.forFeature([TreeEffects]),

    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class GeoModule {}
