import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-table',
  imports: [EmptyStateComponent, MatCardModule, MatProgressBarModule, MatTableModule],
  templateUrl: './client-table.html',
  styleUrl: './client-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTableComponent {
  readonly clients = input<Client[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);

  protected readonly displayedColumns = ['fullName', 'phone', 'email', 'status'];
}
