import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadsectionListComponent } from './roadsection-list.component';

describe('RoadsectionListComponent', () => {
  let component: RoadsectionListComponent;
  let fixture: ComponentFixture<RoadsectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadsectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadsectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
