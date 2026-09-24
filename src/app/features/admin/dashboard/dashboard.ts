import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardStats } from '../services/dashboard-stats';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements AfterViewInit {
  private stats = inject(DashboardStats);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('occupancyChart') occupancyChartRef!: ElementRef<HTMLCanvasElement>;

  totalRevenue = 0;
  occupancyRate = 0;

  ngAfterViewInit(): void {
    this.stats.getTotalRevenue().subscribe(totalRevenue => this.totalRevenue = totalRevenue);
    this.stats.getOccupancyRate().subscribe(occupancyRate => this.occupancyRate = occupancyRate);
    this.stats.getRevenueByRoom().subscribe(data => this.renderRevenueChart(data));
    this.stats.getMonthlyOccupancy().subscribe(data => this.renderOccupancyChart(data));
  }

  private renderRevenueChart(data: ReturnType<DashboardStats['getRevenueByRoom']> extends infer Result
    ? Result extends import('rxjs').Observable<infer Value> ? Value : never
    : never): void {
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => `Room ${d.roomNumber}`),
        datasets: [{
          label: 'Revenue (CLP)',
          data: data.map(d => d.revenue),
          backgroundColor: '#254c4b'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  private renderOccupancyChart(data: ReturnType<DashboardStats['getMonthlyOccupancy']> extends infer Result
    ? Result extends import('rxjs').Observable<infer Value> ? Value : never
    : never): void {
    new Chart(this.occupancyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [{
          label: 'Reservations',
          data: data.map(d => d.count),
          backgroundColor: data.map(d => d.season === 'high' ? '#9c4a3a' : '#a9834f')
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}