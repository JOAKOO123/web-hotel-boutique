import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Rooms } from '../services/rooms';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-reservations-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reservations-create.html',
  styleUrl: './reservations-create.scss'
})
export class ReservationsCreate {
  private reservationsService = inject(Reservations);
  private roomsService = inject(Rooms);
  private router = inject(Router);

  rooms = this.roomsService.getAll();

  guestName = '';
  roomNumber = '';
  checkInDate = '';
  checkOutDate = '';
  status: Reservation['status'] = 'pending';

  private nightsBetween(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  onSubmit(): void {
    const room = this.rooms.find(r => r.number === this.roomNumber);
    const nights = this.nightsBetween(this.checkInDate, this.checkOutDate);
    const totalAmount = room ? room.pricePerNight * nights : 0;

    // TODO: replace with real HTTP POST to ms-reservation via API Gateway on deployment
    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      guestName: this.guestName,
      roomNumber: this.roomNumber,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      status: this.status,
      totalAmount
    };

    this.reservationsService.add(newReservation);
    this.router.navigate(['/reservations']);
  }

  onCancel(): void {
    this.router.navigate(['/reservations']);
  }
}
