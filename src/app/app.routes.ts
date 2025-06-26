import { Routes } from '@angular/router';
import { RoleManagementComponent } from './components/role-management/role-management.component';

export const appRoutes: Routes = [
  { path: 'roles', component: RoleManagementComponent },
  { path: '', redirectTo: 'roles', pathMatch: 'full' } // لو حابة تعملي تحويل تلقائي
];
