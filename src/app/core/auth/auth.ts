import { Injectable, signal, computed } from '@angular/core';
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

export interface LoginOptions {
  returnUrl?: string;
  signup?: boolean;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private msalConfig = {
    auth: {
      clientId: environment.entra.clientId,
      authority: `https://login.microsoftonline.com/${environment.entra.tenantId}/v2.0`,
      redirectUri: `${window.location.origin}/auth/callback`
    },
    cache: {
      cacheLocation: 'localStorage' as const,
      storeAuthStateInCookie: false
    }
  };

  private pca = new PublicClientApplication(this.msalConfig);
  private currentAccount = signal<AccountInfo | null>(null);
  private authResult = signal<AuthenticationResult | null>(null);
  loading = signal(true);

  isAuthenticated = computed(() => !!this.currentAccount());

  isAdmin = computed(() => {
    const claims = this.authResult()?.idTokenClaims as Record<string, unknown> | undefined;
    const roles = claims?.['roles'] as string[] | undefined;
    return !!roles?.includes('ADMIN');
  });

  isCliente = computed(() => {
    const claims = this.authResult()?.idTokenClaims as Record<string, unknown> | undefined;
    const roles = claims?.['roles'] as string[] | undefined;
    return !!roles?.includes('CLIENTE');
  });

  async initialize(): Promise<void> {
    try {
      await this.pca.initialize();

      // handleRedirectPromise debe ejecutarse primero para capturar el token de Entra.
      const result = await this.pca.handleRedirectPromise();
      if (result) {
        console.log('Token capturado del redirect:', result);
        this.authResult.set(result);
        this.currentAccount.set(result.account);
      } else {
        // Si no hay redirect, verifica si ya hay una sesión almacenada.
        const accounts = this.pca.getAllAccounts();
        if (accounts.length > 0) {
          this.currentAccount.set(accounts[0]);
          try {
            const tokenResult = await this.pca.acquireTokenSilent({
              scopes: [environment.entra.scope],
              account: accounts[0]
            });
            this.authResult.set(tokenResult);
          } catch (error) {
            console.warn('Silent token acquisition failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  login(options?: LoginOptions): void {
    this.pca.loginRedirect({
      scopes: [environment.entra.scope],
      prompt: 'select_account'
    });
  }

  async handleLoginCallback(): Promise<string | null> {
    try {
      const result = await this.pca.handleRedirectPromise();
      if (result) {
        this.authResult.set(result);
        this.currentAccount.set(result.account);
      }
      return null;
    } catch (error) {
      console.error('Login callback error:', error);
      return null;
    }
  }

  getEmail(): string {
    return this.currentAccount()?.username ?? '';
  }

  getDisplayName(): string {
    return this.currentAccount()?.name ?? '';
  }

  async logout(): Promise<void> {
    this.currentAccount.set(null);
    this.authResult.set(null);

    await this.pca.logoutRedirect({
      postLogoutRedirectUri: `${window.location.origin}/`
    });
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.currentAccount()) {
      return null;
    }

    try {
      const result = await this.pca.acquireTokenSilent({
        scopes: [environment.entra.scope],
        account: this.currentAccount()!
      });
      return result.accessToken;
    } catch (error) {
      console.error('Token acquisition error:', error);
      return null;
    }
  }

  getIdToken(): string | null {
    return this.authResult()?.idToken ?? null;
  }
}
