import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Rooms } from '../../reservations/services/rooms';
import { RoomAvailability } from '../../reservations/services/room-availability';
import { roomStatusLabels, roomTypeLabels } from '../../../shared/labels';
import { Habitacion } from '../../reservations/models/room.model';

@Component({
  selector: 'app-rooms-status',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './rooms-status.html',
  styleUrl: './rooms-status.scss'
})
export class RoomsStatus {
  private roomsService = inject(Rooms);
  private roomAvailability = inject(RoomAvailability);

  rooms = this.roomsService.getAll();
  statusLabels = roomStatusLabels;
  typeLabels = roomTypeLabels;

  getStatus(roomId: number) {
    return this.roomAvailability.getStatus(roomId.toString());
  }

  getImage(habitacion: Habitacion): string {
    return this.roomsService.getImage(habitacion);
  }
}
