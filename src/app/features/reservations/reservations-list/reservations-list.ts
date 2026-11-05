import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservations } from '../services/reservations';
import { Reserva } from '../models/reservation.model';
import { reservationStatusLabels } from '../../../shared/labels';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.scss'
})
export class ReservationsList {
  private reservationsService = inject(Reservations);
  reservations = signal<Reserva[]>([]);
  statusLabels = reservationStatusLabels;
  actionError = signal<string>('');
  processingId = signal<number | null>(null);

  constructor() {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.reservationsService.getAll().subscribe({
      next: data => this.reservations.set(data),
      error: err => console.error('Error loading reservations', err)
    });
  }

  private updateLocal(updated: Reserva): void {
    this.reservations.update(list => list.map(r => (r.id === updated.id ? updated : r)));
  }

  canCheckin(reservation: Reserva): boolean {
    return reservation.estado === 'CONFIRMADA';
  }

  canCheckout(reservation: Reserva): boolean {
    return reservation.estado === 'CHECK_IN';
  }

  canCancelar(reservation: Reserva): boolean {
    return reservation.estado === 'CONFIRMADA' || reservation.estado === 'CHECK_IN';
  }

  onCheckin(reservation: Reserva): void {
    this.runAction(reservation, this.reservationsService.checkin(reservation.id));
  }

  onCheckout(reservation: Reserva): void {
    this.runAction(reservation, this.reservationsService.checkout(reservation.id));
  }

  onCancelar(reservation: Reserva): void {
    if (!confirm(`¿Cancelar la reserva de ${reservation.usuarioEmail}?`)) return;
    this.runAction(reservation, this.reservationsService.cancelar(reservation.id));
  }

  private runAction(reservation: Reserva, request: ReturnType<Reservations['checkin']>): void {
    this.actionError.set('');
    this.processingId.set(reservation.id);
    request.subscribe({
      next: updated => {
        this.updateLocal(updated);
        this.processingId.set(null);
      },
      error: err => {
        this.actionError.set(err?.error?.message || 'No se pudo actualizar la reserva.');
        this.processingId.set(null);
      }
    });
  }
}