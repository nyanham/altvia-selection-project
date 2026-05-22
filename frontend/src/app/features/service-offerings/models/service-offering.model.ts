export interface ServiceOffering {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOfferingUpsertRequest {
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
}