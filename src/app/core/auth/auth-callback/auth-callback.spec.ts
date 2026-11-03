import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthCallback } from './auth-callback';

describe('AuthCallback', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCallback],
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthCallback);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
