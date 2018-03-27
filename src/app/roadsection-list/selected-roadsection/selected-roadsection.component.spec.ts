import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRoadsectionComponent } from './selected-roadsection.component';

describe('SelectedRoadsectionComponent', () => {
  let component: SelectedRoadsectionComponent;
  let fixture: ComponentFixture<SelectedRoadsectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedRoadsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRoadsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
