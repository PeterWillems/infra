import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCivilstructureComponent } from './selected-civilstructure.component';

describe('SelectedCivilstructureComponent', () => {
  let component: SelectedCivilstructureComponent;
  let fixture: ComponentFixture<SelectedCivilstructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCivilstructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCivilstructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
