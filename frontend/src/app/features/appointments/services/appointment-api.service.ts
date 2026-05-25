import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiBaseUrl, apiEndpoints } from '../../../core/config/api.config';
import { AppointmentCalendarItem } from '../models/appointment-calendar-item.model';
import {
  Appointment,
  AppointmentStatusUpdateRequest,
  AppointmentUpsertRequest,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiBaseUrl}/${apiEndpoints.appointments}`;

  list() {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  create(request: AppointmentUpsertRequest) {
    return this.http.post<Appointment>(this.baseUrl, request);
  }

  getCalendarItems(startAt: string, endAt: string, professionalId?: number) {
    let params = new HttpParams().set('startAt', startAt).set('endAt', endAt);

    if (professionalId !== undefined) {
      params = params.set('professionalId', professionalId);
    }

    return this.http.get<AppointmentCalendarItem[]>(`${this.baseUrl}/calendar`, { params });
  }

  update(appointmentId: number, request: AppointmentUpsertRequest) {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}`, request);
  }

  updateStatus(appointmentId: number, request: AppointmentStatusUpdateRequest) {
    return this.http.patch<Appointment>(`${this.baseUrl}/${appointmentId}/status`, request);
  }
}
