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
      // URL corregida agregando login y el tenantId dinámico
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

  // Métodos de roles corregidos para abarcar cualquier claim de roles disponible
  isAdmin = computed(() => {
    const activeClaims = this.authResult()?.idTokenClaims as Record<string, unknown> | undefined;
    const cachedClaims = this.currentAccount()?.idTokenClaims as Record<string, unknown> | undefined;
    const accessTokenClaims = this.authResult() as unknown as Record<string, unknown> | undefined;
    
    const roles = (
      activeClaims?.['roles'] || 
      cachedClaims?.['roles'] || 
      (accessTokenClaims?.['claims'] as Record<string, unknown>)?.['roles']
    ) as string[] | undefined;
    
    return !!roles?.includes('ADMIN');
  });

  isCliente = computed(() => {
    const activeClaims = this.authResult()?.idTokenClaims as Record<string, unknown> | undefined;
    const cachedClaims = this.currentAccount()?.idTokenClaims as Record<string, unknown> | undefined;
    const accessTokenClaims = this.authResult() as unknown as Record<string, unknown> | undefined;
    
    const roles = (
      activeClaims?.['roles'] || 
      cachedClaims?.['roles'] || 
      (accessTokenClaims?.['claims'] as Record<string, unknown>)?.['roles']
    ) as string[] | undefined;
    
    return !!roles?.includes('CLIENTE');
  });

  async initialize(): Promise<void> {
    try {
      await this.pca.initialize();

      const result = await this.pca.handleRedirectPromise();
      if (result) {
        console.log('Token capturado del redirect:', result);
        this.authResult.set(result);
        this.currentAccount.set(result.account);
      } else {
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
    const account = this.currentAccount();
    this.currentAccount.set(null);
    this.authResult.set(null);

    // Redirección explícita de logout limpia de MSAL
    await this.pca.logoutRedirect({
      account: account ?? undefined,
      postLogoutRedirectUri: `${window.location.origin}/login`
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
      this.authResult.set(result);
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
