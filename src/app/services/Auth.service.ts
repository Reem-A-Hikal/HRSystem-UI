import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IAuthResponse } from '../models/IAuthResponse';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly EXPIRATION_KEY = 'token_expiration';

  constructor(private http: HttpClient, private router: Router) {}

  login(
    formData: { email: string; password: string },
    returnUrl?: string
  ): Observable<IAuthResponse> {
    return this.http
      .post<IAuthResponse>(
        `${environment.apiBaseUrl}/Accounts/login`,
        formData,
        this.getAuthHeaders()
      )
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          }
          this.redirectToFirstAccessiblePage(response.permissions);
        })
      );
  }
  redirectToFirstAccessiblePage(permissions: string[]) {
    const routesMap = [
      { permission: 'Users-View', path: '/dashboard/Users' },
      { permission: 'Roles-View', path: '/dashboard/Roles' },
      { permission: 'Employees-View', path: '/dashboard/Employees' },
      { permission: 'Attendance-View', path: '/dashboard/Attendance' },
      { permission: 'SalaryReport-View', path: '/dashboard/SalaryReport' },
      {
        permission: 'OfficialHoliday-View',
        path: '/dashboard/official-holiday',
      },
      { permission: 'Settings-View', path: '/dashboard/general-setting' },
    ];

    for (const route of routesMap) {
      if (permissions.includes(route.permission)) {
        this.router.navigate([route.path]);
        return;
      }
    }

    this.router.navigate(['/access-denied']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);

    if (!token || !expiration) return false;

    return new Date(expiration) > new Date();
  }

  saveAuthData(auth: IAuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.EXPIRATION_KEY, auth.expiresOn);

    const data: IUser = {
      fullName: auth.fullName,
      roles: auth.roles,
      userId: auth.userId,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(data));
    localStorage.setItem('permissions', JSON.stringify(auth.permissions));
  }

  hasPermission(permission: string): boolean {
    const permissionsJson = localStorage.getItem('permissions');
    if (!permissionsJson) return false;

    let permissions: string[] = [];

    try {
      permissions = JSON.parse(permissionsJson);
    } catch (e) {
      console.error('Invalid permissions JSON', e);
      return false;
    }

    return permissions.includes(permission);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(
        payload.replace(/-/g, '+').replace(/_/g, '/')
      );
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`,
      }),
    };
  }
  canShowActionsColumn(
    editPermission: string,
    deletePermission: string
  ): boolean {
    return (
      this.hasPermission(editPermission) || this.hasPermission(deletePermission)
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('permissions');
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      const user: IUser = JSON.parse(userJson);
      return user.userId || null;
    } catch {
      return null;
    }
  }

  getCurrentUserFullName(): string | undefined {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return undefined;

    try {
      const user: IUser = JSON.parse(userJson);
      return user.fullName || undefined;
    } catch {
      return undefined;
    }
  }

  getCurrentUserRoles(): string[] {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return [];

    try {
      const user: IUser = JSON.parse(userJson);
      return user.roles || [];
    } catch (e) {
      console.error('Error parsing user roles from localStorage', e);
      return [];
    }
  }
}
