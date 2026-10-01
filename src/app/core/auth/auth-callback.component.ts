import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <p>Completando autenticación...</p>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    // Espera a que initialize() termine antes de evaluar la sesión.
    const interval = setInterval(() => {
      if (!this.auth.loading()) {
        clearInterval(interval);
        if (this.auth.isAuthenticated()) {
          console.log('Autenticado, navegando a dashboard');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('No autenticado, volviendo a login');
          this.router.navigate(['/login']);
        }
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      this.router.navigate(['/dashboard']);
    }, 3000);
  }
}
