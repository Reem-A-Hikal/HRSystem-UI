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

  login(formData: {
    email: string;
    password: string;
  }): Observable<IAuthResponse> {
    return this.http
      .post<IAuthResponse>(
        `${environment.apiBaseUrl}/Accounts/login`,
        formData,
        this.getAuthHeaders()
      )
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
          this.router.navigate(['/dashboard/Users']);
        })
      );
  }

  saveAuthData(auth: IAuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.EXPIRATION_KEY, auth.expiresOn);

    const data: IUser = {
      fullName: auth.fullName,
      roles: auth.roles,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(data));
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(this.TOKEN_KEY)}`,
      }),
    };
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/']);
  }
}
