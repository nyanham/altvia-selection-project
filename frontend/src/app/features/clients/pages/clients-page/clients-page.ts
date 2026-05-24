import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ClientTableComponent } from '../../components/client-table/client-table';
import { Client } from '../../models/client.model';
import { ClientApiService } from '../../services/client-api.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-clients-page',
  imports: [ClientTableComponent, PageHeaderComponent],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent {
  private readonly clientApiService = inject(ClientApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly clients = signal<Client[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadClients();
  }

  protected reloadClients(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.clientApiService
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (clients) => {
          this.clients.set(clients);
        },
        error: () => {
          this.clients.set([]);
          this.errorMessage.set('Unable to load clients right now. Check that the backend is running.');
        },
      });
  }
}
