import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

export const authGuard: CanActivateFn = () => {
  const guardService = inject(AuthGuardService);
  return guardService.canActivate();
};
