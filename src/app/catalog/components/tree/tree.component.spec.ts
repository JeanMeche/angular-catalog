/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CatalogEffects } from '../../store/catalog.effects';
import { featureKey, reducer } from '../../store/catalog.reducer';
import { TreeComponent } from './tree.component';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeComponent],
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([CatalogEffects]),
      ],
    }).compileComponents();
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
