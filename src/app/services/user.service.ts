
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 private apiUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  addUser(user: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}`, user); 
}

updateUser(user: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${user.id}`, user); 
}

deleteUser(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`); 
}

getUserById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`); 
}

assignRole(userId: string, roleName: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${userId}/roles`, JSON.stringify(roleName), {
    headers: { 'Content-Type': 'application/json' }
  });
}
  private editingUser: any = null;

  setEditingUser(user: any) {
    this.editingUser = user;
  }

  getEditingUser() {
    return this.editingUser;
  }

  clearEditingUser() {
    this.editingUser = null;
  }
}
