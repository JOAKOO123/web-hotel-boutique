import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'guest';

@Injectable({ providedIn: 'root' })
export class Auth {
  // TODO: replace with real Cognito integration + user groups on deployment
  private loggedIn = signal<boolean>(false);
  private userRole = signal<UserRole>('guest');
  private mockToken = 'mock-jwt-token';

  isAuthenticated() {
    return this.loggedIn();
  }

  isAdmin() {
    return this.userRole() === 'admin';
  }

  login(email: string, password: string, asAdmin: boolean = false): void {
    console.log('Mock login with', email, password);
    this.loggedIn.set(true);
    this.userRole.set(asAdmin ? 'admin' : 'guest');
  }

  logout(): void {
    this.loggedIn.set(false);
    this.userRole.set('guest');
  }

  getToken(): string | null {
    return this.loggedIn() ? this.mockToken : null;
  }
}
