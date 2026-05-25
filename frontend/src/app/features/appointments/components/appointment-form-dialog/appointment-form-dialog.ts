import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { getInterfaceLocale } from '../../../../core/config/locale.config';
import { Client } from '../../../clients/models/client.model';
import { Professional } from '../../../professionals/models/professional.model';
import { ServiceOffering } from '../../../service-offerings/models/service-offering.model';
import { Appointment, AppointmentUpsertRequest } from '../../models/appointment.model';

const interfaceLocale = getInterfaceLocale();

interface AppointmentFormDialogData {
  appointment: Appointment | null;
  clients: Client[];
  professionals: Professional[];
  serviceOfferings: ServiceOffering[];
}

@Component({
  selector: 'app-appointment-form-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './appointment-form-dialog.html',
  styleUrl: './appointment-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormDialogComponent {
  private readonly data = inject<AppointmentFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AppointmentFormDialogComponent, AppointmentUpsertRequest>);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly clients = this.data.clients;
  protected readonly professionals = this.data.professionals;
  protected readonly serviceOfferings = this.data.serviceOfferings;
  protected readonly isEditMode = this.data.appointment !== null;
  protected readonly canSchedule =
    this.clients.length > 0 && this.professionals.length > 0 && this.serviceOfferings.length > 0;

  protected readonly form = this.formBuilder.nonNullable.group({
    clientId: [this.data.appointment?.client.id ?? 0, [Validators.min(1)]],
    professionalId: [this.data.appointment?.professional.id ?? 0, [Validators.min(1)]],
    serviceOfferingId: [this.data.appointment?.serviceOffering.id ?? 0, [Validators.min(1)]],
    startAt: [
      this.data.appointment ? toDateTimeLocalValue(this.data.appointment.startAt) : nextDateTimeLocalValue(),
      [Validators.required],
    ],
    notes: [this.data.appointment?.notes ?? '', [Validators.maxLength(500)]],
  });

  protected get endAtPreview(): string | null {
    const startAt = this.form.controls.startAt.value;
    const serviceOfferingId = this.form.controls.serviceOfferingId.value;
    const serviceOffering = this.serviceOfferings.find((item) => item.id === serviceOfferingId);

    if (!startAt || !serviceOffering) {
      return null;
    }

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + serviceOffering.durationMinutes);
    return endAt.toLocaleString(interfaceLocale, {
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
    });
  }

  protected close(): void {
    this.dialogRef.close();
  }

  protected save(): void {
    if (!this.canSchedule || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      clientId: value.clientId,
      professionalId: value.professionalId,
      serviceOfferingId: value.serviceOfferingId,
      startAt: toApiDateTime(value.startAt),
      notes: normalizeOptionalValue(value.notes),
    });
  }
}

function nextDateTimeLocalValue(): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() + (30 - (date.getMinutes() % 30 || 30)));
  date.setSeconds(0, 0);
  return toDateTimeLocalValue(date.toISOString());
}

function normalizeOptionalValue(value: string): string | null {
  const normalizedValue = value.trim();
  return normalizedValue.length ? normalizedValue : null;
}

function toApiDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

function toDateTimeLocalValue(value: string): string {
  return value.slice(0, 16);
}