import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilstructureListComponent } from './civilstructure-list.component';

describe('CivilstructureListComponent', () => {
  let component: CivilstructureListComponent;
  let fixture: ComponentFixture<CivilstructureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilstructureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilstructureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
