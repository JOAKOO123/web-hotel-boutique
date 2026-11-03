import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReservationsCreate } from './reservations-create';

describe('ReservationsCreate', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsCreate],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReservationsCreate);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
