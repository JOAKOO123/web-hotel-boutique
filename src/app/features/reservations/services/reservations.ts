import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reserva, ReservaRequest } from '../models/reservation.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Reservations {
  private http = inject(HttpClient);
  private baseUrl = `${environment.reservasApiUrl}/reservas`;

  create(request: ReservaRequest) {
    return this.http.post<Reserva>(this.baseUrl, request);
  }

  getMine() {
    return this.http.get<Reserva[]>(`${this.baseUrl}/mias`);
  }

  getAll() {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  checkin(id: number) {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}/checkin`, {});
  }

  checkout(id: number) {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}/checkout`, {});
  }

  cancelar(id: number) {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}/cancelar`, {});
  }
}