import { TestBed } from '@angular/core/testing';

import { ZplConverterService } from './zpl-converter.service';

describe('ZplConverterService', () => {
  let service: ZplConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZplConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
