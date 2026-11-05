import { Injectable, signal, computed } from '@angular/core';
import { UserManager, User } from 'oidc-client-ts';
import { environment } from '../../../environments/environment';

export interface LoginOptions {
  returnUrl?: string;
  signup?: boolean;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private userManager = new UserManager({
    authority: `https://cognito-idp.${environment.cognito.region}.amazonaws.com/${environment.cognito.userPoolId}`,
    client_id: environment.cognito.clientId,
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    response_type: 'code',
    scope: 'openid email phone',
    automaticSilentRenew: false,
    loadUserInfo: true
  });

  private currentUser = signal<User | null>(null);
  loading = signal(true);

  isAuthenticated = computed(() => !!this.currentUser() && !this.currentUser()!.expired);

  isAdmin = computed(() => {
    const groups = this.currentUser()?.profile?.['cognito:groups'] as string[] | undefined;
    return !!groups?.includes('ADMIN');
  });

  async initialize(): Promise<void> {
    const user = await this.userManager.getUser();
    this.currentUser.set(user);
    this.loading.set(false);
  }

  login(options?: LoginOptions): Promise<void> {
    return this.userManager.signinRedirect({
      state: options?.returnUrl,
      extraQueryParams: options?.signup ? { screen_hint: 'signup' } : undefined
    });
  }

  async handleLoginCallback(): Promise<string | null> {
    const user = await this.userManager.signinRedirectCallback();
    this.currentUser.set(user);
    return (user.state as string | undefined) ?? null;
  }

  getEmail(): string {
    return (this.currentUser()?.profile?.['email'] as string) ?? '';
  }

  getDisplayName(): string {
    const email = this.getEmail();
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async logout(): Promise<void> {
    await this.userManager.removeUser();
    this.currentUser.set(null);
    const logoutUrl = `${environment.cognito.domain}/logout?client_id=${environment.cognito.clientId}&logout_uri=${encodeURIComponent(window.location.origin + '/')}`;
    window.location.href = logoutUrl;
  }

  getIdToken(): string | null {
    return this.currentUser()?.id_token ?? null;
  }
}
