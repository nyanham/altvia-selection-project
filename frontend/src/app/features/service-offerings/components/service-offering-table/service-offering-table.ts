import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { ServiceOffering } from '../../models/service-offering.model';

@Component({
  selector: 'app-service-offering-table',
  imports: [CurrencyPipe, EmptyStateComponent, MatCardModule, MatProgressBarModule, MatTableModule],
  templateUrl: './service-offering-table.html',
  styleUrl: './service-offering-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOfferingTableComponent {
  readonly serviceOfferings = input<ServiceOffering[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);

  protected readonly displayedColumns = ['name', 'duration', 'price', 'status'];
}
