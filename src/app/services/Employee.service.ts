import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICreateEmployeeRequest,
  IEmployee,
  IUpdateEmployeeRequest,
} from '../models/IEmployee';
import { Observable } from 'rxjs';
import { ICreateEmployeeResponse } from '../models/IAuthResponse';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  // Create Employee
  createEmployee(
    employeeData: ICreateEmployeeRequest
  ): Observable<ICreateEmployeeResponse> {
    return this.http.post<ICreateEmployeeResponse>(
      `${environment.apiBaseUrl}/Accounts/register`,
      employeeData,
      this.getAuthHeaders()
    );
  }

  // Get All Employees
  getAllEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(
      `${environment.apiBaseUrl}/Employee`,
      this.getAuthHeaders()
    );
  }

  // Get Employee by ID
  getEmployeeById(id: string): Observable<IEmployee> {
    return this.http.get<IEmployee>(
      `${environment.apiBaseUrl}/Employee/${id}`,
      this.getAuthHeaders()
    );
  }

  // Update Employee
  updateEmployee(
    id: string,
    employeeData: IUpdateEmployeeRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${environment.apiBaseUrl}/Employee/${id}`,
      employeeData,
      this.getAuthHeaders()
    );
  }

  // Delete Employee
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/Employee/${id}`,
      this.getAuthHeaders()
    );
  }

  // Get Departments
  getDepartments() {
    return this.http.get<{ id: number; name: string }[]>(
      `${environment.apiBaseUrl}/Department`,
      this.getAuthHeaders()
    );
  }

  getByDepartment() {
    //??????????????????????
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
