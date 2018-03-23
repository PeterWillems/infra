import { TestBed, inject } from '@angular/core/testing';

import { RoadsectionService } from './roadsection.service';

describe('RoadsectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoadsectionService]
    });
  });

  it('should be created', inject([RoadsectionService], (service: RoadsectionService) => {
    expect(service).toBeTruthy();
  }));
});
