import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class RoleGuardService {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[] | undefined;

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles) {
      if (requiredRoles.includes('ADMIN') && this.auth.isAdmin()) {
        return true;
      }

      if (requiredRoles.includes('CLIENTE') && this.auth.isCliente()) {
        return true;
      }

      console.warn(
        'Rol no autorizado. Requerido:',
        requiredRoles,
        'Usuario es admin:',
        this.auth.isAdmin()
      );
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

export const roleGuard: CanActivateFn = (route) => {
  const guardService = inject(RoleGuardService);
  return guardService.canActivate(route);
};
