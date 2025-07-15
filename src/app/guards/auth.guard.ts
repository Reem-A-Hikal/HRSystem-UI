import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from '../services/Auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn();
    const requiredPermissions = route.data['permission'];

    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    // Special handling for employee dashboard - allow access if user has "User" role
    if (state.url.includes('/employee-dashboard')) {
      if (this.authService.hasRole('User')) {
        return true;
      }
      // If not a "User" role, redirect to access denied
      return this.router.parseUrl('/access-denied');
    }

    if (requiredPermissions) {
      if (typeof requiredPermissions === 'string') {
        if (!this.authService.hasPermission(requiredPermissions)) {
          return this.router.parseUrl('/access-denied');
        }
      }

      if (Array.isArray(requiredPermissions)) {
        const hasAnyPermission = requiredPermissions.some((perm) =>
          this.authService.hasPermission(perm)
        );
        if (!hasAnyPermission) {
          return this.router.parseUrl('/access-denied');
        }
      }
    }

    return true;
  }
}
