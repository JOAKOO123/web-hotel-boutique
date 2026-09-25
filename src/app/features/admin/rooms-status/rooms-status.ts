import { Component, inject, signal } from '@angular/core';
import { Rooms } from '../../reservations/services/rooms';
import { RoomAvailability } from '../../reservations/services/room-availability';
import { roomStatusLabels, roomTypeLabels } from '../../../shared/labels';
import { Habitacion } from '../../reservations/models/room.model';

@Component({
  selector: 'app-rooms-status',
  standalone: true,
  imports: [],
  templateUrl: './rooms-status.html',
  styleUrl: './rooms-status.scss'
})
export class RoomsStatus {
  private roomsService = inject(Rooms);
  private roomAvailability = inject(RoomAvailability);

  rooms = signal<Habitacion[]>([]);
  statusLabels = roomStatusLabels;
  typeLabels = roomTypeLabels;

  constructor() {
    this.roomsService.getAll().subscribe({
      next: data => this.rooms.set(data),
      error: err => console.error('Error loading rooms', err)
    });
  }

  getStatus(roomId: number) {
    return this.roomAvailability.getStatus(roomId.toString());
  }

  getImage(habitacion: Habitacion): string {
    return this.roomsService.getImage(habitacion);
  }
}
