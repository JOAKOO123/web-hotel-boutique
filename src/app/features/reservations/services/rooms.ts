import { Injectable, signal } from '@angular/core';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class Rooms {
  // TODO: replace with real HTTP call to ms-reservation via API Gateway on deployment
  private mockRooms = signal<Room[]>([
    { number: '101', type: 'single', pricePerNight: 45000 },
    { number: '102', type: 'single', pricePerNight: 45000 },
    { number: '204', type: 'double', pricePerNight: 65000 },
    { number: '205', type: 'double', pricePerNight: 65000 },
    { number: '305', type: 'suite', pricePerNight: 120000 },
    { number: '306', type: 'suite', pricePerNight: 120000 }
  ]);

  getAll() {
    return this.mockRooms();
  }
}