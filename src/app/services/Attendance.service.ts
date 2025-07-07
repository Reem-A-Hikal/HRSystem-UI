import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AttendanceDto,
  AttendanceRecord,
  AttendanceUpdateDto,
  DeleteResponse,
  PaginatedList,
} from '../models/IAttendance';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiBaseUrl}/Attendance`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(this.apiUrl);
  }

  getPaginated(
    pageIndex: number = 1,
    pageSize: number = 5,
    searchTerm?: string,
    startDate?: Date,
    endDate?: Date
  ): Observable<PaginatedList<AttendanceRecord>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<PaginatedList<AttendanceRecord>>(
      `${this.apiUrl}/paginated`,
      { params }
    );
  }

  getById(id: number | null): Observable<AttendanceRecord> {
    return this.http.get<AttendanceRecord>(`${this.apiUrl}/${id}`);
  }

  add(attendance: AttendanceDto): Observable<AttendanceUpdateDto> {
    return this.http.post<AttendanceUpdateDto>(this.apiUrl, attendance);
  }

  updateAttendance(
    attendance: AttendanceUpdateDto
  ): Observable<AttendanceUpdateDto> {
    return this.http.put<AttendanceUpdateDto>(this.apiUrl, attendance);
  }

  deleteAttendance(id: number | null): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
