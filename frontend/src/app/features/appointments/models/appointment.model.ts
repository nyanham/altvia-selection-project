export interface AppointmentSummary {
  id: number;
  fullName: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export interface ProfessionalSummary {
  id: number;
  fullName: string;
  colorHex: string;
}

export interface ServiceOfferingSummary {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: number;
  client: AppointmentSummary;
  professional: ProfessionalSummary;
  serviceOffering: ServiceOfferingSummary;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentUpsertRequest {
  clientId: number;
  professionalId: number;
  serviceOfferingId: number;
  startAt: string;
  notes: string | null;
}

export interface AppointmentStatusUpdateRequest {
  status: AppointmentStatus;
}

export type CalendarView = 'day' | 'week';
