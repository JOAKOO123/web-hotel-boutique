import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Rooms } from '../services/rooms';
import { RoomAvailability } from '../services/room-availability';
import { Habitacion } from '../models/room.model';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  rooms = signal<Habitacion[]>([]);
  roomTypeLabels = roomTypeLabels;

  roomNumber = '';
  checkInDate = '';
  checkOutDate = '';
  errorMessage = '';
  saving = false;

  ngOnInit(): void {
    this.roomsService.getAvailable().subscribe({
      next: rooms => {
        this.rooms.set(rooms);
        const preselected = this.route.snapshot.queryParamMap.get('room');
        if (preselected && rooms.some(room => room.id.toString() === preselected)) {
          this.selectRoom(preselected);
        }
      },
      error: err => console.error('Error loading rooms', err)
    });
  }

  get selectedRoomPrice(): number {
    const room = this.rooms().find(r => r.id.toString() === this.roomNumber);
    return room ? room.precioPorNoche : 0;
  }

  get selectedRoomImage(): string | null {
    const room = this.rooms().find(r => r.id.toString() === this.roomNumber);
    return room ? this.roomsService.getImage(room) : null;
  }

  roomImage(habitacion: Habitacion): string {
    return this.roomsService.getImage(habitacion);
  }

  onRangeSelected(range: { checkIn: string; checkOut: string }): void {
    this.checkInDate = range.checkIn;
    this.checkOutDate = range.checkOut;
  }

  selectRoom(roomNumber: string): void {
    this.roomNumber = roomNumber;
    this.roomAvailability.startPending(roomNumber);
    this.errorMessage = '';
  }

  changeRoom(): void {
    this.roomAvailability.release(this.roomNumber);
    this.roomNumber = '';
    this.checkInDate = '';
    this.checkOutDate = '';
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.saving = true;
    this.errorMessage = '';

    this.reservationsService.create({
      habitacionId: Number(this.roomNumber),
      fechaCheckin: this.checkInDate,
      fechaCheckout: this.checkOutDate
    }).subscribe({
      next: () => {
        this.roomAvailability.release(this.roomNumber);
        this.router.navigate(['/my-reservations']);
      },
      error: err => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo crear la reserva. Verifica que la habitación esté disponible en esas fechas.';
      }
    });
  }

  onCancel(): void {
    if (this.roomNumber) {
      this.roomAvailability.release(this.roomNumber);
    }
    this.router.navigate(['/']);
  }
}
