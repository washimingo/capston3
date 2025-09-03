import { TestBed } from '@angular/core/testing';

import { Apisimulada } from './apisimulada';

describe('Apisimulada', () => {
  let service: Apisimulada;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Apisimulada);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
