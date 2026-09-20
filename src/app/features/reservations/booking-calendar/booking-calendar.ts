import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

interface CalendarDay {
  date: Date;
  day: number;
  price: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

interface MonthView {
  label: string;
  days: CalendarDay[];
}

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-calendar.html',
  styleUrl: './booking-calendar.scss'
})
export class BookingCalendar implements OnChanges {
  @Input({ required: true }) pricePerNight = 0;
  @Output() rangeSelected = new EventEmitter<{ checkIn: string; checkOut: string }>();

  months: MonthView[] = [];
  checkIn: Date | null = null;
  checkOut: Date | null = null;
  lowestPrice = 0;

  private today = new Date();
  private baseMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricePerNight']) {
      this.buildMonths();
    }
  }

  private priceFor(date: Date): number {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const raw = isWeekend ? this.pricePerNight * 1.15 : this.pricePerNight;
    return Math.round(raw / 1000) * 1000;
  }

  private buildMonths(): void {
    this.months = [0, 1].map(offset => this.buildMonth(offset));
    const allPrices = this.months.flatMap(m =>
      m.days.filter(d => d.isCurrentMonth && !d.isPast).map(d => d.price)
    );
    this.lowestPrice = allPrices.length ? Math.min(...allPrices) : 0;
  }

  private buildMonth(monthOffset: number): MonthView {
    const monthDate = new Date(this.baseMonth.getFullYear(), this.baseMonth.getMonth() + monthOffset, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push({ date: new Date(0), day: 0, price: 0, isCurrentMonth: false, isPast: true, isWeekend: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      const dayOfWeek = date.getDay();
      days.push({
        date,
        day: d,
        price: this.priceFor(date),
        isCurrentMonth: true,
        isPast,
        isWeekend: dayOfWeek === 5 || dayOfWeek === 6
      });
    }

    return {
      label: monthDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
      days
    };
  }

  onDayClick(day: CalendarDay): void {
    if (!day.isCurrentMonth || day.isPast) return;

    if (!this.checkIn || (this.checkIn && this.checkOut)) {
      this.checkIn = day.date;
      this.checkOut = null;
      return;
    }

    if (day.date <= this.checkIn) {
      this.checkIn = day.date;
      return;
    }

    this.checkOut = day.date;
    this.rangeSelected.emit({
      checkIn: this.toIsoDate(this.checkIn),
      checkOut: this.toIsoDate(this.checkOut)
    });
  }

  isSelected(day: CalendarDay): boolean {
    return day.isCurrentMonth && (this.sameDay(day.date, this.checkIn) || this.sameDay(day.date, this.checkOut));
  }

  isInRange(day: CalendarDay): boolean {
    if (!this.checkIn || !this.checkOut || !day.isCurrentMonth) return false;
    return day.date > this.checkIn && day.date < this.checkOut;
  }

  isLowest(day: CalendarDay): boolean {
    return day.isCurrentMonth && !day.isPast && day.price === this.lowestPrice;
  }

  private sameDay(a: Date, b: Date | null): boolean {
    if (!b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
