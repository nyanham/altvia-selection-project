import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-service-offering-table',
  imports: [EmptyStateComponent, MatCardModule],
  templateUrl: './service-offering-table.html',
  styleUrl: './service-offering-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceOfferingTableComponent {
}