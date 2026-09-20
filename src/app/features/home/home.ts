import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Rooms } from '../reservations/services/rooms';
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

  rooms = this.roomsService.getAll();
  roomTypeLabels = roomTypeLabels;
  checkIn = '';
  checkOut = '';
  guests = 1;

  onSearch(): void {
    this.router.navigate(['/reservations/new'], {
      queryParams: { checkIn: this.checkIn, checkOut: this.checkOut, guests: this.guests }
    });
  }

  roomImage(roomNumber: string): string {
    return this.roomsService.getImage(roomNumber);
  }

  onSuiteClick(roomNumber: string): void {
    this.router.navigate(['/reservations/new'], { queryParams: { room: roomNumber } });
  }

  roomDescription(type: string): string {
    const descriptions: Record<string, string> = {
      single: 'Un espacio íntimo pensado para viajeros que buscan comodidad sin excesos.',
      double: 'Amplitud y luz natural, ideal para estadías en pareja o viajes de trabajo prolongados.',
      suite: 'Nuestro nivel más alto: living independiente, terminaciones en madera noble y vista privilegiada.'
    };
    return descriptions[type] ?? '';
  }
}
