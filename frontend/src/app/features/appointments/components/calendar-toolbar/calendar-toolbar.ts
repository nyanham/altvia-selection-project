import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CalendarView } from '../../models/appointment.model';

@Component({
  selector: 'app-calendar-toolbar',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './calendar-toolbar.html',
  styleUrl: './calendar-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarToolbarComponent {
  readonly selectedProfessionalId = input<number | null>(null);
  readonly selectedView = input<CalendarView>('week');
  readonly professionals = input<readonly { id: number; fullName: string }[]>([]);
  readonly rangeLabel = input('');

  readonly nextRequested = output<void>();
  readonly previousRequested = output<void>();
  readonly professionalChanged = output<number | null>();
  readonly todayRequested = output<void>();
  readonly viewChanged = output<CalendarView>();

  protected readonly views: ReadonlyArray<{ label: string; value: CalendarView }> = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ];
}
