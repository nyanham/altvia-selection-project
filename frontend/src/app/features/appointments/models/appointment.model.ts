export interface AppointmentSummary {
  id: number;
  fullName: string;
}

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
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CalendarView = 'day' | 'week';