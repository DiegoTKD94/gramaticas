import { TestBed } from '@angular/core/testing';

import { LinkedListService } from './linked-list.service';

describe('LinkedListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkedListService = TestBed.get(LinkedListService);
    expect(service).toBeTruthy();
  });
});
