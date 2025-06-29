import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { Observable } from 'rxjs';
import { ICreateEmployeeResponse } from '../models/IAuthResponse';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  createEmployee(employeeData: IEmployee): Observable<ICreateEmployeeResponse> {
    return this.http.post<ICreateEmployeeResponse>(
      `${environment.apiBaseUrl}/Accounts/register`,
      employeeData,
      this.getAuthHeaders()
    );
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`,
      }),
    };
  }
}
