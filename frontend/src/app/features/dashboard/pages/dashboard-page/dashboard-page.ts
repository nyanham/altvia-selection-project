import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface DashboardMetric {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly metrics: DashboardMetric[] = [
    {
      label: 'Appointments today',
      value: '18',
      icon: 'event_available',
    },
    {
      label: 'Professionals active',
      value: '6',
      icon: 'groups',
    },
    {
      label: 'Clients this week',
      value: '43',
      icon: 'face',
    },
    {
      label: 'Service utilization',
      value: '82%',
      icon: 'insights',
    },
  ];
}
