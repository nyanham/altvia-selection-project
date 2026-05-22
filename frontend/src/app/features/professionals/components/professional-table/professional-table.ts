import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-professional-table',
  imports: [EmptyStateComponent, MatCardModule],
  templateUrl: './professional-table.html',
  styleUrl: './professional-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalTableComponent {
}