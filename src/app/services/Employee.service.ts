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

  // Get All Employees
  getAllEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(
      `${environment.apiBaseUrl}/Employees`,
      this.getAuthHeaders()
    );
  }

  // Get single Employee by ID
  getEmployeeById(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(
      `${environment.apiBaseUrl}/Employees/${id}`,
      this.getAuthHeaders()
    );
  }

  // Update Employee
  updateEmployee(id: number, employeeData: IEmployee): Observable<any> {
    return this.http.put<any>(
      `${environment.apiBaseUrl}/Employees/${id}`,
      employeeData,
      this.getAuthHeaders()
    );
  }

  // Delete Employee
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/Employees/${id}`,
      this.getAuthHeaders()
    );
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
