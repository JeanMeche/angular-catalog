import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TreeComponent } from './components/tree/tree.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TreeEffects } from './store/geo.effects';
import { featureKey, geoReducer } from './store/geo.reducer';
import { ApiModule } from '../api';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [TreeComponent, CardComponent],
  exports: [TreeComponent, MatIconModule],
  imports: [
    ApiModule,
    CommonModule,
    StoreModule.forFeature(featureKey, geoReducer),
    EffectsModule.forFeature([TreeEffects]),

    MatTreeModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class GeoModule {}
