import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { Rooms } from '../../reservations/services/rooms';
import { Reservations } from '../../reservations/services/reservations';
import { Habitacion } from '../../reservations/models/room.model';
import { Reserva } from '../../reservations/models/reservation.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements AfterViewInit {
  private roomsService = inject(Rooms);
  private reservationsService = inject(Reservations);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('occupancyChart') occupancyChartRef!: ElementRef<HTMLCanvasElement>;

  totalRevenue = 0;
  occupancyRate = 0;

  private rooms: Habitacion[] = [];
  private reservas: Reserva[] = [];

  ngAfterViewInit(): void {
    forkJoin({
      rooms: this.roomsService.getAll(),
      reservas: this.reservationsService.getAll()
    }).subscribe({
      next: ({ rooms, reservas }) => {
        this.rooms = rooms;
        this.reservas = reservas.filter(r => r.estado !== 'CANCELADA');
        this.computeSummary();
        this.renderRevenueChart();
        this.renderOccupancyChart();
      },
      error: err => console.error('Error loading dashboard data', err)
    });
  }

  private nights(checkIn: string, checkOut: string): number {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  private revenueFor(reserva: Reserva): number {
    const room = this.rooms.find(r => r.nombre === reserva.habitacionNombre);
    return room ? room.precioPorNoche * this.nights(reserva.fechaCheckin, reserva.fechaCheckout) : 0;
  }

  private computeSummary(): void {
    this.totalRevenue = this.reservas.reduce((sum, r) => sum + this.revenueFor(r), 0);
    const occupiedRoomNames = new Set(this.reservas.map(r => r.habitacionNombre));
    this.occupancyRate = this.rooms.length ? Math.round((occupiedRoomNames.size / this.rooms.length) * 100) : 0;
  }

  private renderRevenueChart(): void {
    const revenueByRoom = this.rooms.map(room => ({
      nombre: room.nombre,
      revenue: this.reservas.filter(r => r.habitacionNombre === room.nombre).reduce((sum, r) => sum + this.revenueFor(r), 0)
    }));

    new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: revenueByRoom.map(d => d.nombre),
        datasets: [{ label: 'Ingresos (CLP)', data: revenueByRoom.map(d => d.revenue), backgroundColor: '#254c4b' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  private renderOccupancyChart(): void {
    const counts = new Map<string, number>();
    for (const r of this.reservas) {
      const month = r.fechaCheckin.slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
    const average = entries.length ? entries.reduce((sum, [, c]) => sum + c, 0) / entries.length : 0;

    new Chart(this.occupancyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: entries.map(([month]) => month),
        datasets: [{ label: 'Reservas', data: entries.map(([, count]) => count), backgroundColor: entries.map(([, count]) => count > average ? '#9c4a3a' : '#a9834f') }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
}