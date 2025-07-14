import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        async loadComponent() {
          const m = await import(
            './components/dashboard-view/dashboard-view.component'
          );
          return m.DashboardViewComponent;
        },
      },
      {
        path: 'Employees',
        loadComponent: () =>
          import(
            './components/EmployeesPage/employeesdata/employeesdata.component'
          ).then((m) => m.EmployeesdataComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Employees-View' },
      },
      {
        path: 'Employees/add-employee',
        loadComponent: () =>
          import(
            './components/EmployeesPage/add-employee/add-employee.component'
          ).then((m) => m.AddEmployeeComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Employees-Add' },
      },
      {
        path: 'Employees/view-employee/:id',
        loadComponent: () =>
          import(
            './components/EmployeesPage/view-employee/view-employee.component'
          ).then((m) => m.ViewEmployeeComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Employees-View' },
      },
      {
        path: 'Employees/edit-employee/:id',
        loadComponent: () =>
          import(
            './components/EmployeesPage/edit-employee/edit-employee.component'
          ).then((m) => m.EditEmployeeComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Employees-Edit' },
      },

      {
        path: 'Attendance',
        loadComponent: () =>
          import(
            './components/AttendancePage/Attendance/Attendance.component'
          ).then((m) => m.AttendanceComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Attendance-View' },
      },
      {
        path: 'Attendance/ManageAttendance',
        loadComponent: () =>
          import(
            './components/AttendancePage/manageAttendance/manageAttendance.component'
          ).then((m) => m.ManageAttendanceComponent),
        canActivate: [AuthGuard],
        data: { permission: ['Attendance-Add', 'Attendance-Edit'] },
      },
      {
        path: 'Attendance/ManageAttendance/:id',
        loadComponent: () =>
          import(
            './components/AttendancePage/manageAttendance/manageAttendance.component'
          ).then((m) => m.ManageAttendanceComponent),
        canActivate: [AuthGuard],
        data: { permission: ['Attendance-Add', 'Attendance-Edit'] },
      },

      {
        path: 'SalaryReport',
        loadComponent: () =>
          import(
            './components/Reports/SalaryReport/SalaryReport.component'
          ).then((m) => m.SalaryReportComponent),
        canActivate: [AuthGuard],
        data: { permission: 'SalaryReport-View' },
      },
      {
        path: 'SalaryReport/EditRecord',
        loadComponent: () =>
          import('./components/Reports/editRecord/editRecord.component').then(
            (m) => m.EditRecordComponent
          ),
        canActivate: [AuthGuard],
        data: { permission: ['SalaryReport-Add', 'SalaryReport-Edit'] },
      },
      {
        path: 'SalaryReport/PrintReport',
        loadComponent: () =>
          import('./components/Reports/PrintReport/PrintReport.component').then(
            (m) => m.PrintReportComponent
          ),
        canActivate: [AuthGuard],
        data: { permission: 'SalaryReport-View' },
      },

      {
        path: 'Roles',
        loadComponent: () =>
          import(
            './components/RolesPage/role-management/role-management.component'
          ).then((m) => m.RoleManagementComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Roles-View' },
      },
      {
        path: 'Roles/manageRole',
        loadComponent: () =>
          import('./components/RolesPage/role-add/role-add.component').then(
            (m) => m.AddRoleComponent
          ),
        canActivate: [AuthGuard],
        data: { permission: ['Roles-Add', 'Roles-Edit'] },
      },

      {
        path: 'Users',
        loadComponent: () =>
          import(
            './components/UsersPage/user-management/user-management.component'
          ).then((m) => m.UserManagementComponent),
        canActivate: [AuthGuard],
        data: { permission: 'Users-View' },
      },
      {
        path: 'Users/add-user',
        loadComponent: () =>
          import('./components/UsersPage/user-add/user-add.component').then(
            (m) => m.AddUserComponent
          ),
        canActivate: [AuthGuard],
        data: { permission: ['Users-Add', 'Users-Edit'] },
      },

      {
        path: 'official-holiday',
        loadComponent: () =>
          import(
            './components/official-holiday/official-holiday.component'
          ).then((m) => m.OfficialHolidayComponent),
        canActivate: [AuthGuard],
        data: { permission: 'OfficialHoliday-View' },
      },
      {
        path: 'general-setting',
        loadComponent: () =>
          import('./components/general-setting/general-setting.component').then(
            (m) => m.GeneralSettingComponent
          ),
        canActivate: [AuthGuard],
        data: { permission: 'Settings-View' },
      },
    ],
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./components/access-denied/access-denied.component').then(
        (m) => m.AccessDeniedComponent
      ),
  },
  { path: '**', redirectTo: '' }, //????
  // { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
