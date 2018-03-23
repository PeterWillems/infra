import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadsectionSelectionComponent } from './roadsection-selection.component';

describe('RoadsectionSelectionComponent', () => {
  let component: RoadsectionSelectionComponent;
  let fixture: ComponentFixture<RoadsectionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadsectionSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadsectionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
