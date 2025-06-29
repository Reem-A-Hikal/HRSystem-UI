import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EmployeesdataComponent } from './components/employeesdata/employeesdata.component';
import { OfficialHolidayComponent } from './components/official-holiday/official-holiday.component';
import { EditOfficialHolidayComponent } from './components/edit-official-holiday/edit-official-holiday.component';
import { GeneralSettingComponent } from './components/general-setting/general-setting.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'roles', component: RoleManagementComponent },
      { path: 'employees', component: EmployeesdataComponent },
      { path:'official-holiday', component:OfficialHolidayComponent },
      { path:'edit-official-holiday/:id', component: EditOfficialHolidayComponent },
      { path: 'general-setting', component:GeneralSettingComponent },
    ],
  },
];
