import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SalaryApiResponse } from '../models/IEmployeeSalary';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  getSalaryReports(pageIndex: number, pageSize: number, searchTerm?: string, month?: number | null, year?: number | null): Observable<SalaryApiResponse> {
  let params = new HttpParams()
    .set('pageIndex', pageIndex)
    .set('pageSize', pageSize);

  if (searchTerm) params = params.set('searchTerm', searchTerm);
  if (month !== null && month !== undefined) params = params.set('month', month);
  if (year !== null && year !== undefined) params = params.set('year', year);

    return this.http.get<SalaryApiResponse>(`${environment.apiBaseUrl}/payroll/paginated`, { params });
  }

  
  

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`,
      }),
    };
  }
}
