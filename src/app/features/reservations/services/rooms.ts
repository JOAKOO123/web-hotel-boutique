import { Injectable, signal } from '@angular/core';
import { Habitacion } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class Rooms {
  // TODO: replace with real HTTP call to ms-reservation via API Gateway on deployment
  private mockRooms = signal<Habitacion[]>([
    { id: 101, nombre: 'Habitación 101', tipo: 'INDIVIDUAL', capacidad: 1, precioPorNoche: 45000, disponible: true, descripcion: 'Un espacio íntimo y confortable.', imagenUrl: null },
    { id: 102, nombre: 'Habitación 102', tipo: 'INDIVIDUAL', capacidad: 1, precioPorNoche: 45000, disponible: true, descripcion: 'Un espacio íntimo y confortable.', imagenUrl: null },
    { id: 204, nombre: 'Habitación 204', tipo: 'DOBLE', capacidad: 2, precioPorNoche: 65000, disponible: true, descripcion: 'Amplitud y luz natural.', imagenUrl: null },
    { id: 205, nombre: 'Habitación 205', tipo: 'DOBLE', capacidad: 2, precioPorNoche: 65000, disponible: true, descripcion: 'Amplitud y luz natural.', imagenUrl: null },
    { id: 305, nombre: 'Suite 305', tipo: 'SUITE', capacidad: 2, precioPorNoche: 120000, disponible: true, descripcion: 'Living independiente y vista privilegiada.', imagenUrl: null },
    { id: 306, nombre: 'Suite 306', tipo: 'SUITE', capacidad: 2, precioPorNoche: 120000, disponible: true, descripcion: 'Living independiente y vista privilegiada.', imagenUrl: null }
  ]);

  getAll() {
    return this.mockRooms();
  }

  getImage(habitacion: Habitacion): string {
    return habitacion.imagenUrl || `https://picsum.photos/seed/${encodeURIComponent(habitacion.nombre)}/960/640`;
  }
}