import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ITotalEmployees,
  IEmployeesByDepartment,
  IGenderDistribution,
  IAgeGroup,
  INationalityDistribution,
  IAverageDailyAttendance,
  IAverageSalary,
} from '../models/IDashboard';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getTotalEmployees(): Observable<ITotalEmployees> {
    return this.http.get<ITotalEmployees>(
      `${environment.apiBaseUrl}/Employee/dashboard/totalEmployees`
    );
  }

  getEmployeesByDepartmentDashboard(): Observable<IEmployeesByDepartment[]> {
    return this.http.get<IEmployeesByDepartment[]>(
      `${environment.apiBaseUrl}/Employee/dashboard/employeesByDepartment`
    );
  }

  getGenderDistribution(): Observable<IGenderDistribution[]> {
    return this.http.get<IGenderDistribution[]>(
      `${environment.apiBaseUrl}/Employee/dashboard/genderDistribution`
    );
  }

  getAverageSalary(): Observable<IAverageSalary> {
    return this.http.get<IAverageSalary>(
      `${environment.apiBaseUrl}/Employee/dashboard/averageSalary`
    );
  }

  getAgeGroups(): Observable<IAgeGroup[]> {
    return this.http.get<IAgeGroup[]>(
      `${environment.apiBaseUrl}/Employee/dashboard/groupByAge`
    );
  }

  getNationalityDistribution(): Observable<INationalityDistribution[]> {
    return this.http.get<INationalityDistribution[]>(
      `${environment.apiBaseUrl}/Employee/dashboard/nationalityDistribution`
    );
  }

  getAverageDailyAttendance(): Observable<IAverageDailyAttendance> {
    return this.http.get<IAverageDailyAttendance>(
      `${environment.apiBaseUrl}/Attendance/dashboard/averageDailyAttendance`
    );
  }
}
