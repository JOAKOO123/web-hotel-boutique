import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      await this.auth.handleLoginCallback();
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Login callback failed', err);
      this.router.navigate(['/login']);
    }
  }
}
