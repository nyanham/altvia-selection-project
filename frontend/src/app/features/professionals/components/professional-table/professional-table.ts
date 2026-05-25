import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Professional } from '../../models/professional.model';

@Component({
  selector: 'app-professional-table',
  imports: [EmptyStateComponent, MatCardModule, MatProgressBarModule, MatTableModule],
  templateUrl: './professional-table.html',
  styleUrl: './professional-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalTableComponent {
  readonly professionals = input<Professional[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);

  protected readonly displayedColumns = ['fullName', 'specialty', 'phone', 'email', 'color', 'status'];
}
