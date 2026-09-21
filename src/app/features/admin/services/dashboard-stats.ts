import { Injectable, inject } from '@angular/core';
import { Reservations } from '../../reservations/services/reservations';
import { Rooms } from '../../reservations/services/rooms';

export interface MonthlyOccupancy {
  month: string;
  count: number;
  season: 'high' | 'low';
}

export interface RoomRevenue {
  roomNumber: string;
  revenue: number;
  bookings: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardStats {
  private reservationsService = inject(Reservations);
  private roomsService = inject(Rooms);

  getTotalRevenue(): number {
    return this.reservationsService.getAll()
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);
  }

  getOccupancyRate(): number {
    const rooms = this.roomsService.getAll();
    const activeReservations = this.reservationsService.getAll()
      .filter(r => r.status !== 'cancelled');
    if (rooms.length === 0) return 0;
    const occupiedRooms = new Set(activeReservations.map(r => r.roomNumber));
    return Math.round((occupiedRooms.size / rooms.length) * 100);
  }

  getRevenueByRoom(): RoomRevenue[] {
    const rooms = this.roomsService.getAll();
    const reservations = this.reservationsService.getAll()
      .filter(r => r.status !== 'cancelled');

    return rooms.map(room => {
      const roomReservations = reservations.filter(r => r.roomNumber === room.id.toString());
      return {
        roomNumber: room.id.toString(),
        revenue: roomReservations.reduce((sum, r) => sum + r.totalAmount, 0),
        bookings: roomReservations.length
      };
    });
  }

  getMonthlyOccupancy(): MonthlyOccupancy[] {
    const reservations = this.reservationsService.getAll()
      .filter(r => r.status !== 'cancelled');

    const counts = new Map<string, number>();
    for (const r of reservations) {
      const month = r.checkInDate.slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    }

    const entries = Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
    if (entries.length === 0) return [];

    const average = entries.reduce((sum, [, count]) => sum + count, 0) / entries.length;

    return entries.map(([month, count]) => ({
      month,
      count,
      season: count > average ? 'high' : 'low'
    }));
  }
}