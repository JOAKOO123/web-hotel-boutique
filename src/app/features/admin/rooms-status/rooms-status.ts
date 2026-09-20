import { Component, inject } from '@angular/core';
import { Rooms } from '../../reservations/services/rooms';
import { RoomAvailability } from '../../reservations/services/room-availability';
import { roomStatusLabels, roomTypeLabels } from '../../../shared/labels';

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

  rooms = this.roomsService.getAll();
  statusLabels = roomStatusLabels;
  typeLabels = roomTypeLabels;

  getStatus(roomNumber: string) {
    return this.roomAvailability.getStatus(roomNumber);
  }

  getImage(roomNumber: string): string {
    return this.roomsService.getImage(roomNumber);
  }
}
