export interface Client {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientUpsertRequest {
  fullName: string;
  phone: string;
  email: string | null;
  notes: string | null;
}