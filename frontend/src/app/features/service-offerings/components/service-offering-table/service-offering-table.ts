import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { ServiceOffering } from '../../models/service-offering.model';

@Component({
  selector: 'app-service-offering-table',
  imports: [
    CurrencyPipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './service-offering-table.html',
  styleUrl: './service-offering-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOfferingTableComponent {
  readonly serviceOfferings = input<ServiceOffering[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);
  readonly deleteRequested = output<ServiceOffering>();
  readonly editRequested = output<ServiceOffering>();

  protected readonly displayedColumns = ['name', 'duration', 'price', 'status', 'actions'];
}
