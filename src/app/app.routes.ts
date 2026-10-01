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
		canActivate: [authGuard], // Permite la entrada base y tu Dashboard gestionará la UI por Signal
		loadComponent: () =>
			import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
	},
	{
		path: 'reservations',
		canActivate: [roleGuard],
		data: { roles: ['ADMIN'] }, // Vista administrativa/global de reservas
		loadComponent: () =>
			import('./features/reservations/reservations-list/reservations-list')
				.then(m => m.ReservationsList)
	},
	{
		path: 'reservations/new',
		canActivate: [roleGuard],
		data: { roles: ['CLIENTE'] }, // Corregido: Solo el cliente/huésped puede generar una reserva
		loadComponent: () =>
			import('./features/reservations/reservations-create/reservations-create')
				.then(m => m.ReservationsCreate)
	},
	{
		path: 'my-reservations',
		canActivate: [roleGuard],
		data: { roles: ['CLIENTE'] }, // Corregido: Solo el cliente/huésped visualiza su historial propio
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
		data: { roles: ['ADMIN'] }, // Control de catálogo e inventario físico de unidades (Habitaciones)
		loadComponent: () =>
			import('./features/admin/rooms-status/rooms-status').then(m => m.RoomsStatus)
	}
];
