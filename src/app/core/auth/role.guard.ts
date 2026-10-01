import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from './auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // 1. Verificar si está autenticado
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Extraer los roles requeridos desde la data de la ruta
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Si la ruta no especifica roles, se permite el acceso por defecto
  if (!requiredRoles) {
    return true;
  }

  // 3. Validar contra los computed signals del servicio Auth
  const isUserAdmin = requiredRoles.includes('ADMIN') && auth.isAdmin();
  const isUserCliente = requiredRoles.includes('CLIENTE') && auth.isCliente();

  if (isUserAdmin || isUserCliente) {
    return true;
  }

  // 4. Si no tiene el rol, alertar en consola y redirigir
  console.warn(
    'Acceso denegado. Roles requeridos:', requiredRoles,
    '| ADMIN:', auth.isAdmin(), '| CLIENTE:', auth.isCliente()
  );
  
  router.navigate(['/dashboard']); // Redirige al dashboard base si no tiene el rol específico
  return false;
};
