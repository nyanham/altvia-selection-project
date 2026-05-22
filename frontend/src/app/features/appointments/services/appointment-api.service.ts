import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiBaseUrl, apiEndpoints } from '../../../core/config/api.config';
import { AppointmentCalendarItem } from '../models/appointment-calendar-item.model';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiBaseUrl}/${apiEndpoints.appointments}`;

  list() {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  getCalendarItems(startAt: string, endAt: string, professionalId?: number) {
    let params = new HttpParams()
      .set('startAt', startAt)
      .set('endAt', endAt);

    if (professionalId !== undefined) {
      params = params.set('professionalId', professionalId);
    }

    return this.http.get<AppointmentCalendarItem[]>(`${this.baseUrl}/calendar`, { params });
  }
}