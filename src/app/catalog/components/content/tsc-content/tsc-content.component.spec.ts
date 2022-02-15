/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TscContentComponent } from './tsc-content.component';

describe('TscContentComponent', () => {
  let component: TscContentComponent;
  let fixture: ComponentFixture<TscContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TscContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TscContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
