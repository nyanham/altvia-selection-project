import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { ProfessionalTableComponent } from '../../components/professional-table/professional-table';
import { Professional, ProfessionalUpsertRequest } from '../../models/professional.model';
import { ProfessionalApiService } from '../../services/professional-api.service';
import { ProfessionalFormDialogComponent } from '../../components/professional-form-dialog/professional-form-dialog';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-professionals-page',
  imports: [PageHeaderComponent, ProfessionalTableComponent, MatDialogModule, MatSnackBarModule],
  templateUrl: './professionals-page.html',
  styleUrl: './professionals-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalsPageComponent {
  private readonly professionalApiService = inject(ProfessionalApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  protected readonly professionals = signal<Professional[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadProfessionals();
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProfessionalFormDialogComponent, {
      width: '34rem',
      data: {
        professional: null,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ProfessionalUpsertRequest | undefined) => {
        if (request) {
          this.createProfessional(request);
        }
      });
  }

  protected openEditDialog(professional: Professional): void {
    const dialogRef = this.dialog.open(ProfessionalFormDialogComponent, {
      width: '34rem',
      data: {
        professional,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request: ProfessionalUpsertRequest | undefined) => {
        if (request) {
          this.updateProfessional(professional.id, request);
        }
      });
  }

  protected deleteProfessional(professional: Professional): void {
    const confirmed = window.confirm(`Delete professional "${professional.fullName}"?`);

    if (!confirmed) {
      return;
    }

    this.professionalApiService
      .delete(professional.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Professional deleted successfully.');
          this.loadProfessionals();
        },
        error: () => {
          this.notificationService.showError('Unable to delete the professional right now.');
        },
      });
  }

  private loadProfessionals(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.professionalApiService
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (professionals) => {
          this.professionals.set(professionals);
        },
        error: () => {
          this.professionals.set([]);
          this.errorMessage.set(
            'Unable to load professionals right now. Check that the backend is running.',
          );
        },
      });
  }

  private createProfessional(request: ProfessionalUpsertRequest): void {
    this.professionalApiService
      .create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Professional created successfully.');
          this.loadProfessionals();
        },
        error: () => {
          this.notificationService.showError('Unable to create the professional right now.');
        },
      });
  }

  private updateProfessional(professionalId: number, request: ProfessionalUpsertRequest): void {
    this.professionalApiService
      .update(professionalId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Professional updated successfully.');
          this.loadProfessionals();
        },
        error: () => {
          this.notificationService.showError('Unable to update the professional right now.');
        },
      });
  }
}
