import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Professional, ProfessionalUpsertRequest } from '../../models/professional.model';

interface ProfessionalFormDialogData {
  professional: Professional | null;
}

@Component({
  selector: 'app-professional-form-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './professional-form-dialog.html',
  styleUrl: './professional-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalFormDialogComponent {
  private readonly data = inject<ProfessionalFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<ProfessionalFormDialogComponent, ProfessionalUpsertRequest>,
  );
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isEditMode = this.data.professional !== null;
  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: [this.data.professional?.fullName ?? '', [Validators.required, Validators.maxLength(120)]],
    phone: [this.data.professional?.phone ?? '', [Validators.required, Validators.maxLength(20)]],
    email: [this.data.professional?.email ?? '', [Validators.email, Validators.maxLength(120)]],
    specialty: [this.data.professional?.specialty ?? '', [Validators.required, Validators.maxLength(120)]],
    colorHex: [
      this.data.professional?.colorHex ?? '#2D6CDF',
      [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
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
      fullName: value.fullName.trim(),
      phone: value.phone.trim(),
      email: this.normalizeOptionalValue(value.email),
      specialty: value.specialty.trim(),
      colorHex: value.colorHex.trim().toUpperCase(),
    });
  }

  private normalizeOptionalValue(value: string): string | null {
    const normalizedValue = value.trim();
    return normalizedValue.length ? normalizedValue : null;
  }
}