import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  // Si la petición va a los servidores de Microsoft, no inyectamos el token
  if (req.url.includes('://microsoftonline.com') || req.url.includes('://microsoft.com')) {
    return next(req);
  }

  // Obtenemos el Access Token de Azure de forma asíncrona
  return from(authService.getAccessToken()).pipe(
    switchMap(token => {
      if (token) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(clonedReq);
      }
      return next(req);
    })
  );
};
