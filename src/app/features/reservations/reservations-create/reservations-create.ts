import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Rooms } from '../services/rooms';
import { RoomAvailability } from '../services/room-availability';
import { Auth } from '../../../core/auth/auth';
import { Reservation } from '../models/reservation.model';
import { BookingCalendar } from '../booking-calendar/booking-calendar';
import { roomTypeLabels } from '../../../shared/labels';

@Component({
  selector: 'app-reservations-create',
  standalone: true,
  imports: [BookingCalendar],
  templateUrl: './reservations-create.html',
  styleUrl: './reservations-create.scss'
})
export class ReservationsCreate implements OnInit {
  private reservationsService = inject(Reservations);
  private roomsService = inject(Rooms);
  private roomAvailability = inject(RoomAvailability);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  rooms = this.roomsService.getAll();
  roomTypeLabels = roomTypeLabels;

  roomNumber = '';
  checkInDate = '';
  checkOutDate = '';

  ngOnInit(): void {
    const preselected = this.route.snapshot.queryParamMap.get('room');
    if (preselected && this.rooms.some(room => room.number === preselected)) {
      this.selectRoom(preselected);
    }
  }

  get selectedRoomPrice(): number {
    const room = this.rooms.find(r => r.number === this.roomNumber);
    return room ? room.pricePerNight : 0;
  }

  get selectedRoomImage(): string | null {
    return this.roomNumber ? this.roomsService.getImage(this.roomNumber) : null;
  }

  roomImage(roomNumber: string): string {
    return this.roomsService.getImage(roomNumber);
  }

  onRangeSelected(range: { checkIn: string; checkOut: string }): void {
    this.checkInDate = range.checkIn;
    this.checkOutDate = range.checkOut;
  }

  selectRoom(roomNumber: string): void {
    this.roomNumber = roomNumber;
    this.roomAvailability.startPending(roomNumber);
  }

  changeRoom(): void {
    this.roomAvailability.release(this.roomNumber);
    this.roomNumber = '';
    this.checkInDate = '';
    this.checkOutDate = '';
  }

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
      guestName: this.auth.getDisplayName(),
      guestEmail: this.auth.getEmail(),
      roomNumber: this.roomNumber,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      status: 'confirmed',
      totalAmount
    };

    this.reservationsService.add(newReservation);
    this.roomAvailability.confirm(this.roomNumber);
    this.router.navigate(['/my-reservations']);
  }

  onCancel(): void {
    if (this.roomNumber) {
      this.roomAvailability.cancel(this.roomNumber);
    }
    this.router.navigate(['/']);
  }
}
