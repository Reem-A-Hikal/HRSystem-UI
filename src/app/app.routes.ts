import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'Employees',
        loadComponent: () =>
          import(
            './components/EmployeesPage/employeesdata/employeesdata.component'
          ).then((m) => m.EmployeesdataComponent),
      },
      {
        path: 'Employees/add-employee',
        loadComponent: () =>
          import(
            './components/EmployeesPage/add-employee/add-employee.component'
          ).then((m) => m.AddEmployeeComponent),
      },
      {
        path: 'Employees/view-employee/:id',
        loadComponent: () =>
          import(
            './components/EmployeesPage/view-employee/view-employee.component'
          ).then((m) => m.ViewEmployeeComponent),
      },
      {
        path: 'Employees/edit-employee/:id',
        loadComponent: () =>
          import(
            './components/EmployeesPage/edit-employee/edit-employee.component'
          ).then((m) => m.EditEmployeeComponent),
      },

      {
        path: 'Attendance',
        loadComponent: () =>
          import(
            './components/AttendancePage/Attendance/Attendance.component'
          ).then((m) => m.AttendanceComponent),
      },
      {
        path: 'Attendance/ManageAttendance',
        loadComponent: () =>
          import(
            './components/AttendancePage/manageAttendance/manageAttendance.component'
          ).then((m) => m.ManageAttendanceComponent),
      },
      {
        path: 'Attendance/ManageAttendance/:id',
        loadComponent: () =>
          import(
            './components/AttendancePage/manageAttendance/manageAttendance.component'
          ).then((m) => m.ManageAttendanceComponent),
      },

      {
        path: 'SalaryReport',
        loadComponent: () =>
          import(
            './components/Reports/SalaryReport/SalaryReport.component'
          ).then((m) => m.SalaryReportComponent),
      },
      {
        path: 'SalaryReport/EditRecord',
        loadComponent: () =>
          import('./components/Reports/editRecord/editRecord.component').then(
            (m) => m.EditRecordComponent
          ),
      },
      {
        path: 'SalaryReport/PrintReport',
        loadComponent: () =>
          import('./components/Reports/PrintReport/PrintReport.component').then(
            (m) => m.PrintReportComponent
          ),
      },

      {
        path: 'Roles',
        loadComponent: () =>
          import(
            './components/RolesPage/role-management/role-management.component'
          ).then((m) => m.RoleManagementComponent),
      },
      {
        path: 'Roles/manageRole',
        loadComponent: () =>
          import('./components/RolesPage/role-add/role-add.component').then(
            (m) => m.AddRoleComponent
          ),
      },

      {
        path: 'Users',
        loadComponent: () =>
          import(
            './components/UsersPage/user-management/user-management.component'
          ).then((m) => m.UserManagementComponent),
      },
      {
        path: 'Users/add-user',
        loadComponent: () =>
          import('./components/UsersPage/user-add/user-add.component').then(
            (m) => m.AddUserComponent
          ),
      },

      {
        path: 'official-holiday',
        loadComponent: () =>
          import(
            './components/official-holiday/official-holiday.component'
          ).then((m) => m.OfficialHolidayComponent),
      },
      {
        path: 'general-setting',
        loadComponent: () =>
          import('./components/general-setting/general-setting.component').then(
            (m) => m.GeneralSettingComponent
          ),
      },
    ],
  },
];
