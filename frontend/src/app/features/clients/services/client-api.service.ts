import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiBaseUrl, apiEndpoints } from '../../../core/config/api.config';
import { Client, ClientUpsertRequest } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiBaseUrl}/${apiEndpoints.clients}`;

  list() {
    return this.http.get<Client[]>(this.baseUrl);
  }

  create(request: ClientUpsertRequest) {
    return this.http.post<Client>(this.baseUrl, request);
  }

  update(clientId: number, request: ClientUpsertRequest) {
    return this.http.put<Client>(`${this.baseUrl}/${clientId}`, request);
  }

  delete(clientId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${clientId}`);
  }
}
