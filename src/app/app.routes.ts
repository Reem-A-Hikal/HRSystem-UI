import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EmployeesdataComponent } from './components/employeesdata/employeesdata.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'roles', component: RoleManagementComponent },
      { path: 'employees', component: EmployeesdataComponent },
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'edit-employee/:id', component: EditEmployeeComponent },
    ],
  },
];
