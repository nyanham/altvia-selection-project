import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize, forkJoin } from 'rxjs';
import { Client } from '../../../clients/models/client.model';
import { ClientApiService } from '../../../clients/services/client-api.service';
import { Professional } from '../../../professionals/models/professional.model';
import { ProfessionalApiService } from '../../../professionals/services/professional-api.service';
import { ServiceOffering } from '../../../service-offerings/models/service-offering.model';
import { ServiceOfferingApiService } from '../../../service-offerings/services/service-offering-api.service';
import { AppointmentScheduleBoardComponent } from '../../components/appointment-schedule-board/appointment-schedule-board';
import { CalendarToolbarComponent } from '../../components/calendar-toolbar/calendar-toolbar';
import { AppointmentFormDialogComponent } from '../../components/appointment-form-dialog/appointment-form-dialog';
import {
  Appointment,
  AppointmentStatus,
  AppointmentUpsertRequest,
  CalendarView,
} from '../../models/appointment.model';
import { AppointmentApiService } from '../../services/appointment-api.service';
import { AppointmentStoreService } from '../../services/appointment-store.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { getInterfaceLocale } from '../../../../core/config/locale.config';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

const interfaceLocale = getInterfaceLocale();

@Component({
  selector: 'app-appointments-calendar-page',
  imports: [
    AppointmentScheduleBoardComponent,
    CalendarToolbarComponent,
    MatDialogModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './appointments-calendar-page.html',
  styleUrl: './appointments-calendar-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsCalendarPageComponent {
  private readonly appointmentApiService = inject(AppointmentApiService);
  private readonly appointmentStoreService = inject(AppointmentStoreService);
  private readonly clientApiService = inject(ClientApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly professionalApiService = inject(ProfessionalApiService);
  private readonly serviceOfferingApiService = inject(ServiceOfferingApiService);
  private readonly selectedDate = signal(startOfDay(new Date()));

  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly clients = signal<Client[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly professionals = signal<Professional[]>([]);
  protected readonly serviceOfferings = signal<ServiceOffering[]>([]);

  protected readonly selectedProfessionalId = this.appointmentStoreService.selectedProfessionalId;
  protected readonly selectedRange = this.appointmentStoreService.selectedRange;
  protected readonly selectedView = this.appointmentStoreService.selectedView;

  protected readonly professionalOptions = computed(() =>
    this.professionals()
      .filter((professional) => professional.active)
      .map((professional) => ({ id: professional.id, fullName: professional.fullName })),
  );

  protected readonly rangeLabel = computed(() => {
    const range = this.selectedRange();

    if (!range) {
      return 'Loading range';
    }

    return formatRangeLabel(range.startAt, range.endAt, this.selectedView());
  });

  protected readonly visibleAppointments = computed(() => {
    const range = this.selectedRange();

    if (!range) {
      return [] as Appointment[];
    }

    const startAt = new Date(range.startAt);
    const endAt = new Date(range.endAt);
    const selectedProfessionalId = this.selectedProfessionalId();
    return this.appointments()
      .filter((appointment) => {
        const appointmentStartAt = new Date(appointment.startAt);
        const appointmentInRange = appointmentStartAt >= startAt && appointmentStartAt <= endAt;
        const matchesProfessional =
          selectedProfessionalId === null || appointment.professional.id === selectedProfessionalId;

        return appointmentInRange && matchesProfessional;
      })
      .sort((left, right) => left.startAt.localeCompare(right.startAt));
  });

  protected readonly appointmentGroups = computed(() => {
    const appointmentGroups = new Map<string, Appointment[]>();

    for (const appointment of this.visibleAppointments()) {
      const key = appointment.startAt.slice(0, 10);
      const currentAppointments = appointmentGroups.get(key) ?? [];
      currentAppointments.push(appointment);
      appointmentGroups.set(key, currentAppointments);
    }

    return Array.from(appointmentGroups.entries()).map(([key, appointments]) => ({
      key,
      label: formatDayLabel(key),
      appointments,
    }));
  });

  constructor() {
    this.syncRange();
    this.loadAppointmentsView();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '34rem',
      data: {
        appointment: null,
        clients: this.clients(),
        professionals: this.professionals(),
        serviceOfferings: this.serviceOfferings(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: AppointmentUpsertRequest | undefined) => {
        if (request) {
          this.createAppointment(request);
        }
      });
  }

  protected openEditDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '34rem',
      data: {
        appointment,
        clients: this.clients(),
        professionals: this.professionals(),
        serviceOfferings: this.serviceOfferings(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: AppointmentUpsertRequest | undefined) => {
        if (request) {
          this.updateAppointment(appointment.id, request);
        }
      });
  }

  protected showNextRange(): void {
    this.selectedDate.update((currentDate) => shiftRange(currentDate, this.selectedView(), 1));
    this.syncRange();
  }

  protected showPreviousRange(): void {
    this.selectedDate.update((currentDate) => shiftRange(currentDate, this.selectedView(), -1));
    this.syncRange();
  }

  protected showToday(): void {
    this.selectedDate.set(startOfDay(new Date()));
    this.syncRange();
  }

  protected updateProfessionalFilter(professionalId: number | null): void {
    this.appointmentStoreService.setSelectedProfessional(professionalId);
  }

  protected updateView(view: CalendarView): void {
    if (this.selectedView() === view) {
      return;
    }

    this.appointmentStoreService.setView(view);
    this.syncRange();
  }

  protected updateAppointmentStatus(appointment: Appointment, status: AppointmentStatus): void {
    this.appointmentApiService
      .updateStatus(appointment.id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Appointment status updated successfully.');
          this.loadAppointmentsView();
        },
        error: (error) => {
          this.notificationService.showError(
            extractErrorMessage(error, 'Unable to update the appointment status right now.'),
          );
        },
      });
  }

  private loadAppointmentsView(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      appointments: this.appointmentApiService.list(),
      clients: this.clientApiService.list(),
      professionals: this.professionalApiService.list(),
      serviceOfferings: this.serviceOfferingApiService.list(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: ({ appointments, clients, professionals, serviceOfferings }) => {
          this.appointments.set(appointments);
          this.clients.set(clients);
          this.professionals.set(professionals);
          this.serviceOfferings.set(serviceOfferings);
        },
        error: () => {
          this.appointments.set([]);
          this.clients.set([]);
          this.professionals.set([]);
          this.serviceOfferings.set([]);
          this.errorMessage.set(
            'Unable to load appointments right now. Check that the backend is running.',
          );
        },
      });
  }

  private createAppointment(request: AppointmentUpsertRequest): void {
    this.appointmentApiService
      .create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Appointment created successfully.');
          this.loadAppointmentsView();
        },
        error: (error) => {
          this.notificationService.showError(
            extractErrorMessage(error, 'Unable to create the appointment right now.'),
          );
        },
      });
  }

  private updateAppointment(appointmentId: number, request: AppointmentUpsertRequest): void {
    this.appointmentApiService
      .update(appointmentId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Appointment updated successfully.');
          this.loadAppointmentsView();
        },
        error: (error) => {
          this.notificationService.showError(
            extractErrorMessage(error, 'Unable to update the appointment right now.'),
          );
        },
      });
  }

  private syncRange(): void {
    const range = buildRange(this.selectedDate(), this.selectedView());

    this.appointmentStoreService.setSelectedRange({
      startAt: toLocalDateTime(range.startAt),
      endAt: toLocalDateTime(range.endAt),
    });
  }
}

function buildRange(date: Date, view: CalendarView): { startAt: Date; endAt: Date } {
  if (view === 'day') {
    return {
      startAt: startOfDay(date),
      endAt: endOfDay(date),
    };
  }

  const startAt = startOfWeek(date);
  return {
    startAt,
    endAt: endOfDay(addDays(startAt, 6)),
  };
}

function shiftRange(date: Date, view: CalendarView, direction: -1 | 1): Date {
  const step = view === 'day' ? 1 : 7;
  return addDays(date, step * direction);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfWeek(date: Date): Date {
  const normalizedDate = startOfDay(date);
  const dayOfWeek = normalizedDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return addDays(normalizedDate, -daysFromMonday);
}

function addDays(date: Date, amount: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function toLocalDateTime(date: Date): string {
  return (
    [
      date.getFullYear().toString().padStart(4, '0'),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
    ].join('-') +
    'T' +
    [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0'),
    ].join(':')
  );
}

function formatRangeLabel(startAt: string, endAt: string, view: CalendarView): string {
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (view === 'day') {
    return startDate.toLocaleDateString(interfaceLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const startLabel = startDate.toLocaleDateString(interfaceLocale, {
    day: 'numeric',
    month: 'short',
  });
  const endLabel = endDate.toLocaleDateString(interfaceLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `${startLabel} - ${endLabel}`;
}

function formatDayLabel(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString(interfaceLocale, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });
}

function extractErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof HttpErrorResponse && typeof error.error?.detail === 'string') {
    return error.error.detail;
  }

  return fallbackMessage;
}
