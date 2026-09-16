import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservations } from '../services/reservations';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.scss'
})
export class ReservationsList {
  private reservationsService = inject(Reservations);
  reservations = this.reservationsService.getAll();
}