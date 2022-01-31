import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TreeComponent } from './components/tree/tree.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TreeEffects } from './store/tree.effects';
import { treeReducer } from './store/tree.reducer';



@NgModule({
  declarations: [TreeComponent],
  exports: [TreeComponent, MatIconModule],
  imports: [
    CommonModule,
    StoreModule.forFeature('tree', treeReducer),
    EffectsModule.forFeature([TreeEffects]),

    MatTreeModule,
    MatIconModule,
  ],
})
export class TreeModule { }
