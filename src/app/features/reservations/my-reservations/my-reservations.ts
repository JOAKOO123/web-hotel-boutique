import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Auth } from '../../../core/auth/auth';
import { reservationStatusLabels } from '../../../shared/labels';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.scss'
})
export class MyReservations {
  private reservationsService = inject(Reservations);
  private auth = inject(Auth);

  reservations = this.reservationsService.getMine(this.auth.getEmail());
  statusLabels = reservationStatusLabels;
}
