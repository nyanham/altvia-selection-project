import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ClientApiService } from '../../../clients/services/client-api.service';
import { AppointmentApiService } from '../../../appointments/services/appointment-api.service';
import { ProfessionalApiService } from '../../../professionals/services/professional-api.service';
import { ServiceOfferingApiService } from '../../../service-offerings/services/service-offering-api.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

interface DashboardCard {
  description: string;
  featured?: boolean;
  icon: string;
  primaryLabel: string;
  primaryValue: string;
  route: string;
  secondaryLabel: string;
  secondaryValue: string;
  title: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, MatIconModule, PageHeaderComponent, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly appointmentApiService = inject(AppointmentApiService);
  private readonly clientApiService = inject(ClientApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly professionalApiService = inject(ProfessionalApiService);
  private readonly serviceOfferingApiService = inject(ServiceOfferingApiService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly stats = signal({
    activeClients: 0,
    activeProfessionals: 0,
    activeServices: 0,
    appointmentsToday: 0,
    attentionAppointments: 0,
    totalAppointments: 0,
    totalClients: 0,
    totalProfessionals: 0,
    totalServices: 0,
  });

  protected readonly cards = computed<DashboardCard[]>(() => {
    const stats = this.stats();

    return [
      {
        title: 'Appointments',
        route: '/appointments',
        icon: 'calendar_month',
        featured: true,
        primaryLabel: 'Today',
        primaryValue: String(stats.appointmentsToday),
        secondaryLabel: 'Needs attention',
        secondaryValue: String(stats.attentionAppointments),
        description: 'Review the live schedule first and keep today moving smoothly.',
      },
      {
        title: 'Clients',
        route: '/clients',
        icon: 'groups',
        primaryLabel: 'Active',
        primaryValue: String(stats.activeClients),
        secondaryLabel: 'Total records',
        secondaryValue: String(stats.totalClients),
        description: 'Open client records, notes, and contact details quickly.',
      },
      {
        title: 'Professionals',
        route: '/professionals',
        icon: 'badge',
        primaryLabel: 'Active',
        primaryValue: String(stats.activeProfessionals),
        secondaryLabel: 'Team size',
        secondaryValue: String(stats.totalProfessionals),
        description: 'Manage staff availability, specialties, and calendar ownership.',
      },
      {
        title: 'Services',
        route: '/services',
        icon: 'content_cut',
        primaryLabel: 'Active',
        primaryValue: String(stats.activeServices),
        secondaryLabel: 'Catalog size',
        secondaryValue: String(stats.totalServices),
        description: 'Maintain the service catalog, pricing, and appointment durations.',
      },
    ];
  });

  protected readonly primaryCard = computed<DashboardCard | null>(
    () => this.cards().find((card) => card.featured) ?? null,
  );

  protected readonly secondaryCards = computed<DashboardCard[]>(() =>
    this.cards().filter((card) => !card.featured),
  );

  constructor() {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      appointments: this.appointmentApiService.list(),
      clients: this.clientApiService.list(),
      professionals: this.professionalApiService.list(),
      services: this.serviceOfferingApiService.list(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: ({ appointments, clients, professionals, services }) => {
          const todayKey = toDateKey(new Date());

          this.stats.set({
            activeClients: clients.filter((client) => client.active).length,
            activeProfessionals: professionals.filter((professional) => professional.active).length,
            activeServices: services.filter((service) => service.active).length,
            appointmentsToday: appointments.filter(
              (appointment) => appointment.startAt.slice(0, 10) === todayKey,
            ).length,
            attentionAppointments: appointments.filter(
              (appointment) =>
                appointment.status === 'CANCELED' || appointment.status === 'NO_SHOW',
            ).length,
            totalAppointments: appointments.length,
            totalClients: clients.length,
            totalProfessionals: professionals.length,
            totalServices: services.length,
          });
        },
        error: () => {
          this.errorMessage.set(
            'Live counts are unavailable right now. You can still use the dashboard cards to open each section.',
          );
        },
      });
  }
}

function toDateKey(date: Date): string {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-');
}
