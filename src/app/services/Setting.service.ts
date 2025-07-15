import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

export enum SettingType {
  Hour = 1,
  Pound = 2,
}

export interface EditSettingDto {
  type: string;
  overTime: number;
  deduction: number;
  firstHoliday: string;
  secondHoliday: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) {}
  getSettings(): Observable<EditSettingDto> {
    return this.http.get<EditSettingDto>(`${environment.apiBaseUrl}/settings`);
  }

  updateSettings(dto: EditSettingDto): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/settings/update`, dto);
  }
}
