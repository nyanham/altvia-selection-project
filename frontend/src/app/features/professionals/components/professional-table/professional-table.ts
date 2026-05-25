import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Professional } from '../../models/professional.model';

@Component({
  selector: 'app-professional-table',
  imports: [
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './professional-table.html',
  styleUrl: './professional-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalTableComponent {
  readonly professionals = input<Professional[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);
  readonly deleteRequested = output<Professional>();
  readonly editRequested = output<Professional>();

  protected readonly displayedColumns = [
    'fullName',
    'specialty',
    'phone',
    'email',
    'color',
    'status',
    'actions',
  ];
}
