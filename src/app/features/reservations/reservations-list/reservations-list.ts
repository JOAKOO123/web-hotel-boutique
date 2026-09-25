import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Reserva } from '../models/reservation.model';
import { reservationStatusLabels } from '../../../shared/labels';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.scss'
})
export class ReservationsList {
  private reservationsService = inject(Reservations);
  reservations = signal<Reserva[]>([]);
  statusLabels = reservationStatusLabels;

  constructor() {
    this.reservationsService.getAll().subscribe({
      next: data => this.reservations.set(data),
      error: err => console.error('Error loading reservations', err)
    });
  }
}