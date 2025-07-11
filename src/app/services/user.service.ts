import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface User {
  id?: string;
  fullName: string;
  userName: string;  
  email: string;
  role: string;
  password?: string;
  roles?: string[];
}

export interface UserResponse {
  message: string;
}

@Injectable({ 
  providedIn: 'root' 
}) 
export class UserService { 
  private apiUrl = `${environment.apiBaseUrl}/User`; 
  private editingUser: User | null = null;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAll`); 
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<UserResponse> { 
    return this.http.post<UserResponse>(`${this.apiUrl}`, user); 
  }

  updateUser(id: string, user: User): Observable<UserResponse> { 
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user); 
  }

  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`);
  }

  addRoleToUser(userId: string, roleName: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${userId}/roles`, roleName);
  }

  setEditingUser(user: User) { 
    this.editingUser = user; 
  }

  getEditingUser(): User | null { 
    return this.editingUser; 
  } 

  clearEditingUser() { 
    this.editingUser = null; 
  } 
}