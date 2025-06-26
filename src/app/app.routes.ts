import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'roles', component: RoleManagementComponent },
];
