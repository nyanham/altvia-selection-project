import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CalendarToolbarComponent } from '../../components/calendar-toolbar/calendar-toolbar';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-appointments-calendar-page',
  imports: [CalendarToolbarComponent, EmptyStateComponent, MatCardModule, PageHeaderComponent],
  templateUrl: './appointments-calendar-page.html',
  styleUrl: './appointments-calendar-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsCalendarPageComponent {
}