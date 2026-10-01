import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  // NO interceptar peticiones internas de MSAL
  if (req.url.includes('login.microsoftonline.com') || 
      req.url.includes('graph.microsoft.com') ||
      req.url.includes('.neon.tech')) { // Neon JWKS
    return next(req);
  }

  return from(auth.getAccessToken()).pipe(
    switchMap(token => {
      if (token) {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(cloned);
      }

      return next(req);
    })
  );
};