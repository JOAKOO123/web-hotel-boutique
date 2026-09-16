import { Injectable, signal } from '@angular/core';
import { Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class Reservations {
  // TODO: replace with real HTTP calls to ms-reservation via API Gateway on deployment
  private mockData = signal<Reservation[]>([
    {
      id: '1',
      guestName: 'Camila Rojas',
      roomNumber: '101',
      checkInDate: '2026-09-20',
      checkOutDate: '2026-09-22',
      status: 'confirmed',
      totalAmount: 90000
    },
    {
      id: '2',
      guestName: 'Matías Fuentes',
      roomNumber: '204',
      checkInDate: '2026-09-21',
      checkOutDate: '2026-09-23',
      status: 'pending',
      totalAmount: 130000
    },
    {
      id: '3',
      guestName: 'Valentina Soto',
      roomNumber: '305',
      checkInDate: '2026-09-18',
      checkOutDate: '2026-09-19',
      status: 'cancelled',
      totalAmount: 120000
    }
  ]);

  getAll() {
    return this.mockData();
  }

  add(reservation: Reservation): void {
    this.mockData.update(list => [...list, reservation]);
  }
}