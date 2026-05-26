import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-schedule-board',
  imports: [
    CurrencyPipe,
    DatePipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
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

  readonly deleteRequested = output<Appointment>();
  readonly editRequested = output<Appointment>();
  readonly statusRequested = output<{ appointment: Appointment; status: AppointmentStatus }>();

  protected readonly statusDetails: Readonly<
    Record<AppointmentStatus, { label: string; icon: string }>
  > = {
    SCHEDULED: { label: 'Scheduled', icon: 'event_available' },
    COMPLETED: { label: 'Completed', icon: 'task_alt' },
    CANCELED: { label: 'Canceled', icon: 'event_busy' },
    NO_SHOW: { label: 'No show', icon: 'person_off' },
  };

  protected readonly totalAppointments = computed(() =>
    this.appointmentGroups().reduce((total, group) => total + group.appointments.length, 0),
  );

  protected readonly statusOptions: ReadonlyArray<{ label: string; value: AppointmentStatus }> = [
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Canceled', value: 'CANCELED' },
    { label: 'No show', value: 'NO_SHOW' },
  ];
}
