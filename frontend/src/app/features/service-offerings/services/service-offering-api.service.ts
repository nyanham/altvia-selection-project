import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiBaseUrl, apiEndpoints } from '../../../core/config/api.config';
import { ServiceOffering, ServiceOfferingUpsertRequest } from '../models/service-offering.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiBaseUrl}/${apiEndpoints.serviceOfferings}`;

  list() {
    return this.http.get<ServiceOffering[]>(this.baseUrl);
  }

  create(request: ServiceOfferingUpsertRequest) {
    return this.http.post<ServiceOffering>(this.baseUrl, request);
  }

  update(serviceOfferingId: number, request: ServiceOfferingUpsertRequest) {
    return this.http.put<ServiceOffering>(`${this.baseUrl}/${serviceOfferingId}`, request);
  }
}