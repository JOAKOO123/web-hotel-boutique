import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () =>
			import('./features/auth/login/login').then(m => m.Login)
	},
	{
		path: 'reservations',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/reservations/reservations-list/reservations-list')
				.then(m => m.ReservationsList)
	},
	{ path: '', redirectTo: 'reservations', pathMatch: 'full' }
];
