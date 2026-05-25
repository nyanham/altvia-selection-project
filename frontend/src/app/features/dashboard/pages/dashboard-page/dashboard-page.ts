import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

interface DashboardMetric {
  label: string;
  value: string;
  icon: string;
  context: string;
}

interface ScheduleSnapshotItem {
  time: string;
  client: string;
  service: string;
  professional: string;
  isNext?: boolean;
}

interface AlertItem {
  title: string;
  description: string;
}

interface DetailItem {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule, PageHeaderComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly router = inject(Router);

  protected readonly metrics: DashboardMetric[] = [
    {
      label: 'Appointments today',
      value: '18',
      icon: 'event_available',
      context: '+3 vs. yesterday',
    },
    {
      label: 'Professionals active',
      value: '6',
      icon: 'groups',
      context: '2 fully booked',
    },
    {
      label: 'Clients this week',
      value: '43',
      icon: 'face',
      context: '9 new visits',
    },
    {
      label: 'Service utilization',
      value: '82%',
      icon: 'insights',
      context: 'Healthy capacity',
    },
  ];

  protected readonly upcomingAppointments: ScheduleSnapshotItem[] = [
    {
      time: '09:30',
      client: 'Mia Johnson',
      service: 'Balayage refresh',
      professional: 'Avery Cole',
      isNext: true,
    },
    {
      time: '11:00',
      client: 'Nina Park',
      service: 'Cut and blowout',
      professional: 'Jordan Lee',
    },
    {
      time: '13:15',
      client: 'Sofia Mendes',
      service: 'Gel manicure',
      professional: 'Riley Quinn',
    },
  ];

  protected readonly alerts: AlertItem[] = [
    {
      title: '2 appointments need confirmation',
      description: 'Reach out before lunch so the afternoon board stays stable.',
    },
    {
      title: 'One no-show this week',
      description: 'Flag the client record before the next booking is made.',
    },
    {
      title: 'Color services are trending heavy',
      description: 'Week view suggests rebalancing longer appointments across professionals.',
    },
  ];

  protected readonly todaySummary: DetailItem[] = [
    {
      label: 'Front desk focus',
      value: 'Next arrival in 20 min',
      note: 'Use the calendar view to prep the consultation notes.',
    },
    {
      label: 'Capacity',
      value: '3 open slots',
      note: 'Best opening is between 14:00 and 15:30.',
    },
  ];

  protected readonly serviceSignals: DetailItem[] = [
    {
      label: 'Top service',
      value: 'Cut and blowout',
      note: 'Booked 6 times this week.',
    },
    {
      label: 'Longest visit',
      value: 'Color correction',
      note: 'Requires 150-minute blocks and earlier confirmation.',
    },
  ];

  protected openAppointments(): void {
    void this.router.navigate(['/appointments']);
  }
}
