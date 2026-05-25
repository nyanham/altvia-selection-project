import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServiceOffering, ServiceOfferingUpsertRequest } from '../../models/service-offering.model';

interface ServiceOfferingFormDialogData {
  serviceOffering: ServiceOffering | null;
}

@Component({
  selector: 'app-service-offering-form-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './service-offering-form-dialog.html',
  styleUrl: './service-offering-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOfferingFormDialogComponent {
  private readonly data = inject<ServiceOfferingFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<ServiceOfferingFormDialogComponent, ServiceOfferingUpsertRequest>,
  );
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isEditMode = this.data.serviceOffering !== null;
  protected readonly form = this.formBuilder.nonNullable.group({
    name: [this.data.serviceOffering?.name ?? '', [Validators.required, Validators.maxLength(120)]],
    description: [this.data.serviceOffering?.description ?? '', [Validators.maxLength(500)]],
    durationMinutes: [
      this.data.serviceOffering ? String(this.data.serviceOffering.durationMinutes) : '',
      [Validators.required, Validators.min(1)],
    ],
    price: [
      this.data.serviceOffering ? this.data.serviceOffering.price.toFixed(2) : '',
      [Validators.required, Validators.min(0.01)],
    ],
  });

  protected close(): void {
    this.dialogRef.close();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      name: value.name.trim(),
      description: this.normalizeOptionalValue(value.description),
      durationMinutes: Number(value.durationMinutes),
      price: Number(value.price),
    });
  }

  private normalizeOptionalValue(value: string): string | null {
    const normalizedValue = value.trim();
    return normalizedValue.length ? normalizedValue : null;
  }
}
