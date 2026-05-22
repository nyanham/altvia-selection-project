import { Injectable, signal } from '@angular/core';
import { CalendarView } from '../models/appointment.model';

export interface CalendarRange {
  startAt: string;
  endAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentStoreService {
  readonly selectedView = signal<CalendarView>('week');
  readonly selectedProfessionalId = signal<number | null>(null);
  readonly selectedRange = signal<CalendarRange | null>(null);

  setView(view: CalendarView): void {
    this.selectedView.set(view);
  }

  setSelectedProfessional(professionalId: number | null): void {
    this.selectedProfessionalId.set(professionalId);
  }

  setSelectedRange(range: CalendarRange): void {
    this.selectedRange.set(range);
  }
}