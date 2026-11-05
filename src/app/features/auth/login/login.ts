import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
  private route = inject(ActivatedRoute, { optional: true });

  get isForReservation(): boolean {
    return !!this.route?.snapshot.queryParamMap.get('returnUrl');
  }

  onLogin(): void {
    const returnUrl = this.route?.snapshot.queryParamMap.get('returnUrl') ?? undefined;
    this.auth.login({ returnUrl });
  }

  onSignup(): void {
    const returnUrl = this.route?.snapshot.queryParamMap.get('returnUrl') ?? undefined;
    this.auth.login({ signup: true, returnUrl });
  }
}