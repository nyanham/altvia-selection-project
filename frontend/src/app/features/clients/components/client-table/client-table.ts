import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-table',
  imports: [
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './client-table.html',
  styleUrl: './client-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTableComponent {
  readonly clients = input<Client[]>([]);
  readonly errorMessage = input<string | null>(null);
  readonly isLoading = input(false);
  readonly deleteRequested = output<Client>();
  readonly editRequested = output<Client>();

  protected readonly displayedColumns = ['fullName', 'phone', 'email', 'status', 'actions'];
}
