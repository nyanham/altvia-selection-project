import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Client, ClientUpsertRequest } from '../../models/client.model';

interface ClientFormDialogData {
  client: Client | null;
}

@Component({
  selector: 'app-client-form-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './client-form-dialog.html',
  styleUrl: './client-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormDialogComponent {
  private readonly data = inject<ClientFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ClientFormDialogComponent, ClientUpsertRequest>);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isEditMode = this.data.client !== null;
  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: [this.data.client?.fullName ?? '', [Validators.required, Validators.maxLength(120)]],
    phone: [this.data.client?.phone ?? '', [Validators.required, Validators.maxLength(20)]],
    email: [this.data.client?.email ?? '', [Validators.email, Validators.maxLength(120)]],
    notes: [this.data.client?.notes ?? '', [Validators.maxLength(500)]],
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
      fullName: value.fullName.trim(),
      phone: value.phone.trim(),
      email: this.normalizeOptionalValue(value.email),
      notes: this.normalizeOptionalValue(value.notes),
    });
  }

  private normalizeOptionalValue(value: string): string | null {
    const normalizedValue = value.trim();
    return normalizedValue.length ? normalizedValue : null;
  }
}