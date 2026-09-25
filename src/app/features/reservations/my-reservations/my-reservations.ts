import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Reserva } from '../models/reservation.model';
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
  reservations = signal<Reserva[]>([]);
  statusLabels = reservationStatusLabels;

  constructor() {
    this.reservationsService.getMine().subscribe({
      next: data => this.reservations.set(data),
      error: err => console.error('Error loading reservations', err)
    });
  }
}
