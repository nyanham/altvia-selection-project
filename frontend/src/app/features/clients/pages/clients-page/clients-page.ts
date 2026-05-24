import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { ClientTableComponent } from '../../components/client-table/client-table';
import { Client, ClientUpsertRequest } from '../../models/client.model';
import { ClientApiService } from '../../services/client-api.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientFormDialogComponent } from '../../components/client-form-dialog/client-form-dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-clients-page',
  imports: [ClientTableComponent, MatDialogModule, MatSnackBarModule, PageHeaderComponent],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent {
  private readonly clientApiService = inject(ClientApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  protected readonly clients = signal<Client[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadClients();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      width: '34rem',
      data: {
        client: null,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ClientUpsertRequest | undefined) => {
        if (request) {
          this.createClient(request);
        }
      });
  }

  protected openEditDialog(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      width: '34rem',
      data: {
        client,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ClientUpsertRequest | undefined) => {
        if (request) {
          this.updateClient(client.id, request);
        }
      });
  }

  protected deleteClient(client: Client): void {
    const confirmed = window.confirm(`Delete client "${client.fullName}"?`);

    if (!confirmed) {
      return;
    }

    this.clientApiService
      .delete(client.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Client deleted successfully.');
          this.loadClients();
        },
        error: () => {
          this.notificationService.showError('Unable to delete the client right now.');
        },
      });
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

  private createClient(request: ClientUpsertRequest): void {
    this.clientApiService
      .create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Client created successfully.');
          this.loadClients();
        },
        error: () => {
          this.notificationService.showError('Unable to create the client right now.');
        },
      });
  }

  private updateClient(clientId: number, request: ClientUpsertRequest): void {
    this.clientApiService
      .update(clientId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Client updated successfully.');
          this.loadClients();
        },
        error: () => {
          this.notificationService.showError('Unable to update the client right now.');
        },
      });
  }
}
