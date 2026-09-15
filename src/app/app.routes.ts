import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'reservations',
		loadComponent: () =>
			import('./features/reservations/reservations-list/reservations-list')
				.then(m => m.ReservationsList)
	},
	{ path: '', redirectTo: 'reservations', pathMatch: 'full' }
];
