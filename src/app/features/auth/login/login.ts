import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  loginAsAdmin = false;

  onSubmit(): void {
    this.auth.login(this.email, this.password, this.loginAsAdmin);
    this.router.navigate([this.loginAsAdmin ? '/reservations' : '/']);
  }
}