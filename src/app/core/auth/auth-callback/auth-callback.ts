import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { Users } from '../../users/users';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback implements OnInit {
  private auth = inject(Auth);
  private users = inject(Users);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      const returnUrl = await this.auth.handleLoginCallback();

      try {
        await new Promise<void>((resolve) => {
          this.users.sync({ nombre: this.auth.getDisplayName() }).subscribe({
            next: () => resolve(),
            error: err => {
              console.error('No se pudo sincronizar el perfil de usuario', err);
              resolve();
            }
          });
        });
      } catch {
        // El login de Cognito ya se completó; el perfil local no debe bloquearlo.
      }

      this.router.navigateByUrl(returnUrl || '/');
    } catch (err) {
      console.error('Login callback failed', err);
      this.router.navigate(['/login']);
    }
  }
}
