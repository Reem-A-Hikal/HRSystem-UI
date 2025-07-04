import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AttendanceRecord, Department, Employee } from '../models/IAttendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  // private apiUrl = 'api/attendance';
  // private employeesUrl = 'api/employees';
  // private departmentsUrl = 'api/departments';

  private mockRecords: AttendanceRecord[] = [

    // Add more mock records as needed
  ];
  constructor() {}

  getAttendanceRecords(): Observable<AttendanceRecord[]> {
    // return this.http.get<AttendanceRecord[]>(this.apiUrl);
    return of(this.mockRecords);
  }

  getAttendanceRecord(id: string | null): Observable<AttendanceRecord> {
    // return this.http.get<AttendanceRecord>(`${this.apiUrl}/${id}`);
    if (id) {
      return of(
        this.mockRecords.find((record) => record.id === id) as AttendanceRecord
      );
    } else {
      return of({
      } as AttendanceRecord);
    }
  }

  addAttendance(record: AttendanceRecord): Observable<AttendanceRecord> {
    // return this.http.post<AttendanceRecord>(this.apiUrl, record);
    return of(record);
  }

  updateAttendance(
    id: string,
    record: AttendanceRecord
  ): Observable<AttendanceRecord> {
    // return this.http.put<AttendanceRecord>(`${this.apiUrl}/${id}`, record);
    return of(record);
  }

  deleteAttendance(id: string): Observable<boolean> {
    // return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    return of(true);
  }

  getEmployees(): Observable<Employee[]> {
    // return this.http.get<Employee[]>(this.employeesUrl);
    return of([
      {
        id: '1',
        name: 'John Doe',
        departmentId: '1',
      },
      {
        id: '2',
        name: 'Jane Doe',
        departmentId: '2',
      },
    ]);
  }

  getDepartments(): Observable<Department[]> {
    // return this.http.get<Department[]>(this.departmentsUrl);
    return of([
      {
        id: '1',
        name: 'Sales',
      },

      {
        id: '2',
        name: 'Marketing',
      },
    ]);
  }
}
