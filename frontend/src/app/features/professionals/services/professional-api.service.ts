import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiBaseUrl, apiEndpoints } from '../../../core/config/api.config';
import { Professional, ProfessionalUpsertRequest } from '../models/professional.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiBaseUrl}/${apiEndpoints.professionals}`;

  list() {
    return this.http.get<Professional[]>(this.baseUrl);
  }

  create(request: ProfessionalUpsertRequest) {
    return this.http.post<Professional>(this.baseUrl, request);
  }

  update(professionalId: number, request: ProfessionalUpsertRequest) {
    return this.http.put<Professional>(`${this.baseUrl}/${professionalId}`, request);
  }

  delete(professionalId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${professionalId}`);
  }
}
