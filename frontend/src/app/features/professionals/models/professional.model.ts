export interface Professional {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  specialty: string;
  colorHex: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalUpsertRequest {
  fullName: string;
  phone: string;
  email: string | null;
  specialty: string;
  colorHex: string;
}