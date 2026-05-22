export interface AppointmentCalendarItem {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  clientId: number;
  clientName: string;
  professionalId: number;
  professionalName: string;
  professionalColorHex: string;
  serviceOfferingId: number;
  serviceOfferingName: string;
}