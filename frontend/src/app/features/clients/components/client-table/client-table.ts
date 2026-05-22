import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-client-table',
  imports: [EmptyStateComponent, MatCardModule],
  templateUrl: './client-table.html',
  styleUrl: './client-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientTableComponent {
}