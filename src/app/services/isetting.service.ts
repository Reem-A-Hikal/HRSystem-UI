import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISetting } from '../models/ISetting';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IsettingService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  // Get Setting by ID
  getSettingById(): Observable<ISetting> {
    return this.http.get<ISetting>(
      `${environment.apiBaseUrl}/Settings`,
      // this.getAuthHeaders()
    );
  }

  // Update Setting
  updateSetting(settingData: ISetting): Observable<any> {
    return this.http.put<any>(
      `${environment.apiBaseUrl}/Settings/update`, // Fixed endpoint
      settingData,
      // this.getAuthHeaders()
    );
  }

  // private getAuthHeaders() {
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`,
  //     }),
  //   };
  // }
}
