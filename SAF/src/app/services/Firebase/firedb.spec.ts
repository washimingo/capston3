import { TestBed } from '@angular/core/testing';

import { Firedb } from './firedb';

describe('Firedb', () => {
  let service: Firedb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Firedb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
