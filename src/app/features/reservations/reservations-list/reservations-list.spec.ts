import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReservationsList } from './reservations-list';

describe('ReservationsList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsList],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReservationsList);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
