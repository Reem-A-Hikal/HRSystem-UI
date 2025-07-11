import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHoliday, IHolidayResponse } from '../models/IHoliday';
import { environment } from '../../environments/environment.development';
import { IDeleteResponse } from '../models/IDeleteResponse';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http :HttpClient ) { }
  createHoliday(holiday: IHoliday) {
    return this.http.post<IHoliday>(`${environment.apiBaseUrl}/OfficialHoliday`, holiday);
  }
  getHolidays() {
    return this.http.get<IHolidayResponse[]>(`${environment.apiBaseUrl}/OfficialHoliday`);
  }
  deleteHoliday(id: number) {
    return this.http.delete<IDeleteResponse>(`${environment.apiBaseUrl}/OfficialHoliday/${id}`);
  }
  updateHoliday(holiday: IHoliday) {
    return this.http.put<IHolidayResponse>(`${environment.apiBaseUrl}/OfficialHoliday`, holiday);
  }
  getHolidayById(id: number) {
    return this.http.get<IHolidayResponse>(`${environment.apiBaseUrl}/OfficialHoliday/${id}`);
  }
}
