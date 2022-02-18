/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TreeComponent } from './tree.component';
import { StoreModule } from '@ngrx/store';
import { featureKey, treeReducer } from '../../store/geo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TreeEffects } from '../../store/geo.effects';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeComponent],
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(featureKey, treeReducer),
        EffectsModule.forFeature([TreeEffects]),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
