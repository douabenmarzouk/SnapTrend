import { TestBed } from '@angular/core/testing';

import { Pinterest } from './pinterest';

describe('Pinterest', () => {
  let service: Pinterest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pinterest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
