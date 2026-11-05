import { Injectable, signal } from '@angular/core';

export type RoomStatus = 'available' | 'pending' | 'confirmed' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class RoomAvailability {
  private statuses = signal<Record<string, RoomStatus>>({});

  private setStatus(roomNumber: string, status: RoomStatus): void {
    this.statuses.update(statuses => ({ ...statuses, [roomNumber]: status }));
  }

  startPending(roomNumber: string): void {
    this.setStatus(roomNumber, 'pending');
  }

  getStatus(roomNumber: string): RoomStatus {
    return this.statuses()[roomNumber] ?? 'available';
  }

  confirm(roomNumber: string): void {
    this.setStatus(roomNumber, 'confirmed');
  }

  cancel(roomNumber: string): void {
    this.setStatus(roomNumber, 'available');
  }

  release(roomNumber: string): void {
    this.setStatus(roomNumber, 'available');
  }
}
