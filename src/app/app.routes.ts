import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin-guard';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./features/home/home').then(m => m.Home)
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./features/auth/login/login').then(m => m.Login)
	},
	{
		path: 'auth/callback',
		loadComponent: () =>
			import('./core/auth/auth-callback/auth-callback').then(m => m.AuthCallback)
	},
	{
		path: 'reservations',
		canActivate: [authGuard, adminGuard],
		loadComponent: () =>
			import('./features/reservations/reservations-list/reservations-list')
				.then(m => m.ReservationsList)
	},
	{
		path: 'reservations/new',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/reservations/reservations-create/reservations-create')
				.then(m => m.ReservationsCreate)
	},
	{
		path: 'my-reservations',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/reservations/my-reservations/my-reservations')
				.then(m => m.MyReservations)
	},
	{
		path: 'admin',
		canActivate: [authGuard, adminGuard],
		loadComponent: () =>
			import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
	},
	{
		path: 'admin/rooms',
		canActivate: [authGuard, adminGuard],
		loadComponent: () =>
			import('./features/admin/rooms-status/rooms-status').then(m => m.RoomsStatus)
	}
];

