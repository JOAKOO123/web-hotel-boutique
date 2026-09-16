import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Auth {
  // TODO: replace with real Cognito integration on deployment
  private loggedIn = signal<boolean>(false);
  private mockToken = 'mock-jwt-token';

  isAuthenticated() {
    return this.loggedIn();
  }

  login(email: string, password: string): void {
    // TODO: replace with Cognito Hosted UI redirect / SDK call
    console.log('Mock login with', email, password);
    this.loggedIn.set(true);
  }

  logout(): void {
    // TODO: replace with Cognito sign-out
    this.loggedIn.set(false);
  }

  getToken(): string | null {
    return this.loggedIn() ? this.mockToken : null;
  }
}
