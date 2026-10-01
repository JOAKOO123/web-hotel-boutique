import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { AuthCallbackComponent } from './core/auth/auth-callback.component';

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
		component: AuthCallbackComponent
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
	},
	{
		path: 'reservations',
		canActivate: [roleGuard],
		data: { roles: ['ADMIN'] },
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
		canActivate: [roleGuard],
		data: { roles: ['ADMIN'] },
		loadComponent: () =>
			import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
	},
	{
		path: 'admin/rooms',
		canActivate: [roleGuard],
		data: { roles: ['ADMIN'] },
		loadComponent: () =>
			import('./features/admin/rooms-status/rooms-status').then(m => m.RoomsStatus)
	}
];

