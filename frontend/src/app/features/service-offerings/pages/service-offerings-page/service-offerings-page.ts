import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { NotificationService } from '../../../../core/services/notification.service';
import { ServiceOfferingFormDialogComponent } from '../../components/service-offering-form-dialog/service-offering-form-dialog';
import { ServiceOfferingTableComponent } from '../../components/service-offering-table/service-offering-table';
import { ServiceOffering, ServiceOfferingUpsertRequest } from '../../models/service-offering.model';
import { ServiceOfferingApiService } from '../../services/service-offering-api.service';

@Component({
  selector: 'app-service-offerings-page',
  imports: [PageHeaderComponent, ServiceOfferingTableComponent, MatDialogModule, MatSnackBarModule],
  templateUrl: './service-offerings-page.html',
  styleUrl: './service-offerings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOfferingsPageComponent {
  private readonly serviceOfferingApiService = inject(ServiceOfferingApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  protected readonly serviceOfferings = signal<ServiceOffering[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadServiceOfferings();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(ServiceOfferingFormDialogComponent, {
      width: '34rem',
      data: {
        serviceOffering: null,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ServiceOfferingUpsertRequest | undefined) => {
        if (request) {
          this.createServiceOffering(request);
        }
      });
  }

  protected openEditDialog(serviceOffering: ServiceOffering): void {
    const dialogRef = this.dialog.open(ServiceOfferingFormDialogComponent, {
      width: '34rem',
      data: {
        serviceOffering,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ServiceOfferingUpsertRequest | undefined) => {
        if (request) {
          this.updateServiceOffering(serviceOffering.id, request);
        }
      });
  }

  protected deleteServiceOffering(serviceOffering: ServiceOffering): void {
    const confirmed = window.confirm(`Delete service "${serviceOffering.name}"?`);

    if (!confirmed) {
      return;
    }

    this.serviceOfferingApiService
      .delete(serviceOffering.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Service deleted successfully.');
          this.loadServiceOfferings();
        },
        error: () => {
          this.notificationService.showError('Unable to delete the service right now.');
        },
      });
  }

  private loadServiceOfferings(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.serviceOfferingApiService
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (serviceOfferings) => {
          this.serviceOfferings.set(serviceOfferings);
        },
        error: () => {
          this.serviceOfferings.set([]);
          this.errorMessage.set(
            'Unable to load services right now. Check that the backend is running.',
          );
        },
      });
  }

  private createServiceOffering(request: ServiceOfferingUpsertRequest): void {
    this.serviceOfferingApiService
      .create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Service created successfully.');
          this.loadServiceOfferings();
        },
        error: () => {
          this.notificationService.showError('Unable to create the service right now.');
        },
      });
  }

  private updateServiceOffering(
    serviceOfferingId: number,
    request: ServiceOfferingUpsertRequest,
  ): void {
    this.serviceOfferingApiService
      .update(serviceOfferingId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Service updated successfully.');
          this.loadServiceOfferings();
        },
        error: () => {
          this.notificationService.showError('Unable to update the service right now.');
        },
      });
  }
}
