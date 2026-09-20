import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'guest';

@Injectable({ providedIn: 'root' })
export class Auth {
  // TODO: replace with real Cognito integration + user groups on deployment
  private loggedIn = signal<boolean>(false);
  private userRole = signal<UserRole>('guest');
  private email = signal<string>('');
  private mockToken = 'mock-jwt-token';

  isAuthenticated() {
    return this.loggedIn();
  }

  isAdmin() {
    return this.userRole() === 'admin';
  }

  getEmail(): string {
    return this.email();
  }

  getDisplayName(): string {
    const email = this.email();
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  login(email: string, password: string, asAdmin: boolean = false): void {
    console.log('Mock login with', email, password);
    this.loggedIn.set(true);
    this.userRole.set(asAdmin ? 'admin' : 'guest');
    this.email.set(email);
  }

  logout(): void {
    this.loggedIn.set(false);
    this.userRole.set('guest');
    this.email.set('');
  }

  getToken(): string | null {
    return this.loggedIn() ? this.mockToken : null;
  }
}
