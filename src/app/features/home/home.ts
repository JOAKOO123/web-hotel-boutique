import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Rooms } from '../reservations/services/rooms';
import { Habitacion } from '../reservations/models/room.model';
import { roomTypeLabels } from '../../shared/labels';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private roomsService = inject(Rooms);
  private router = inject(Router);

  rooms = signal<Habitacion[]>([]);
  roomTypeLabels = roomTypeLabels;
  checkIn = '';
  checkOut = '';
  guests = 1;

  constructor() {
    this.roomsService.getAvailable().subscribe({
      next: rooms => this.rooms.set(rooms),
      error: err => console.error('Error loading rooms', err)
    });
  }

  onSearch(): void {
    this.router.navigate(['/reservations/new'], {
      queryParams: { checkIn: this.checkIn, checkOut: this.checkOut, guests: this.guests }
    });
  }

  roomImage(habitacion: Habitacion): string {
    return this.roomsService.getImage(habitacion);
  }

  onSuiteClick(habitacion: Habitacion): void {
    this.router.navigate(['/reservations/new'], { queryParams: { room: habitacion.id } });
  }

  roomDescription(type: Habitacion['tipo']): string {
    const descriptions: Record<string, string> = {
      INDIVIDUAL: 'Un espacio íntimo pensado para viajeros que buscan comodidad sin excesos.',
      DOBLE: 'Amplitud y luz natural, ideal para estadías en pareja o viajes de trabajo prolongados.',
      SUITE: 'Nuestro nivel más alto: living independiente, terminaciones en madera noble y vista privilegiada.',
      FAMILIAR: 'Un espacio amplio para disfrutar en familia.'
    };
    return descriptions[type] ?? '';
  }
}
