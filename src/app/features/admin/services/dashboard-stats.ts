import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
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

  getTotalRevenue(): Observable<number> {
    return this.getRevenueByRoom().pipe(
      map(revenues => revenues.reduce((sum, room) => sum + room.revenue, 0))
    );
  }

  getOccupancyRate(): Observable<number> {
    return forkJoin({
      rooms: this.roomsService.getAll(),
      reservations: this.reservationsService.getAll()
    }).pipe(map(({ rooms, reservations }) => {
      if (rooms.length === 0) return 0;
      const occupiedRooms = new Set(reservations
        .filter(reservation => reservation.estado !== 'CANCELADA')
        .map(reservation => reservation.habitacionNombre));
      return Math.round((occupiedRooms.size / rooms.length) * 100);
    }));
  }

  getRevenueByRoom(): Observable<RoomRevenue[]> {
    return forkJoin({
      rooms: this.roomsService.getAll(),
      reservations: this.reservationsService.getAll()
    }).pipe(map(({ rooms, reservations }) => rooms.map(room => {
      const roomReservations = reservations.filter(reservation =>
        reservation.habitacionNombre === room.nombre && reservation.estado !== 'CANCELADA');
      return {
        roomNumber: room.id.toString(),
        revenue: roomReservations.reduce((sum, reservation) =>
          sum + room.precioPorNoche * this.nightsBetween(reservation.fechaCheckin, reservation.fechaCheckout), 0),
        bookings: roomReservations.length
      };
    })));
  }

  getMonthlyOccupancy(): Observable<MonthlyOccupancy[]> {
    return this.reservationsService.getAll().pipe(map(reservations => {
      const counts = new Map<string, number>();
      for (const reservation of reservations.filter(item => item.estado !== 'CANCELADA')) {
        const month = reservation.fechaCheckin.slice(0, 7);
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
    }));
  }

  private nightsBetween(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }
}