import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.apiBaseUrl}/Role`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addRole(role: any): Observable<any> {
    return this.http.post(this.apiUrl, role);
  }

  updateRole(role: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${role.id}`, role);
  }

  private editingRole: any = null;

  setEditingRole(role: any) {
    this.editingRole = JSON.parse(JSON.stringify(role));
  }

  getEditingRole() {
    return this.editingRole;
  }

  clearEditingRole() {
    this.editingRole = null;
  }
  getRoleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
