import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-schedule-board',
  imports: [CurrencyPipe, DatePipe, EmptyStateComponent, MatCardModule, MatProgressBarModule],
  templateUrl: './appointment-schedule-board.html',
  styleUrl: './appointment-schedule-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentScheduleBoardComponent {
  readonly appointmentGroups = input<
    ReadonlyArray<{ key: string; label: string; appointments: Appointment[] }>
  >([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);
  readonly rangeLabel = input('');

  protected readonly totalAppointments = computed(() =>
    this.appointmentGroups().reduce((total, group) => total + group.appointments.length, 0),
  );
}