import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habitacion } from '../models/room.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Rooms {
  private http = inject(HttpClient);
  private baseUrl = `${environment.bffApiUrl}/habitaciones`;

  getAvailable() {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/disponibles`);
  }

  getAll() {
    return this.http.get<Habitacion[]>(this.baseUrl);
  }

  getImage(habitacion: Habitacion): string {
    return habitacion.imagenUrl || `https://picsum.photos/seed/${encodeURIComponent(habitacion.nombre)}/960/640`;
  }
}