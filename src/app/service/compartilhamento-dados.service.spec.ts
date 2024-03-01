import { TestBed } from '@angular/core/testing';

import { CompartilhamentoDadosService } from './compartilhamento-dados.service';

describe('CompartilhamentoDadosService', () => {
  let service: CompartilhamentoDadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompartilhamentoDadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
