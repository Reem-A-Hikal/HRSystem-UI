import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/RolesPage/role-management/role-management.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EmployeesdataComponent } from './components/EmployeesPage/employeesdata/employeesdata.component';
import { AttendanceComponent } from './components/AttendancePage/Attendance/Attendance.component';
import { SalaryReportComponent } from './components/Reports/SalaryReport/SalaryReport.component';
import { EditRecordComponent } from './components/Reports/editRecord/editRecord.component';
import { ManageAttendanceComponent } from './components/AttendancePage/manageAttendance/manageAttendance.component';
import { PrintReportComponent } from './components/Reports/PrintReport/PrintReport.component';
import { AddEmployeeComponent } from './components/EmployeesPage/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/EmployeesPage/edit-employee/edit-employee.component';
import { UserManagementComponent } from './components/UsersPage/user-management/user-management.component';
import { AddUserComponent } from './components/UsersPage/user-add/user-add.component';
import { AddRoleComponent } from './components/RolesPage/role-add/role-add.component';
import { OfficialHolidayComponent } from './components/official-holiday/official-holiday.component';
import { EditOfficialHolidayComponent } from './components/edit-official-holiday/edit-official-holiday.component';
import { GeneralSettingComponent } from './components/general-setting/general-setting.component';
import { ViewEmployeeComponent } from './components/EmployeesPage/view-employee/view-employee.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'Employees', component: EmployeesdataComponent },
      { path: 'Employees/add-employee', component: AddEmployeeComponent },
      { path: 'Employees/view-employee/:id', component: ViewEmployeeComponent },
      { path: 'Employees/edit-employee/:id', component: EditEmployeeComponent },

      { path: 'Attendance', component: AttendanceComponent },
      {
        path: 'Attendance/ManageAttendance',
        component: ManageAttendanceComponent,
      },
      {
        path: 'Attendance/ManageAttendance/:id',
        component: ManageAttendanceComponent,
      },
      { path: 'SalaryReport', component: SalaryReportComponent },
      { path: 'SalaryReport/EditRecord', component: EditRecordComponent },
      { path: 'SalaryReport/PrintReport', component: PrintReportComponent },

      { path: 'Roles', component: RoleManagementComponent },
      { path: 'Roles/manageRole', component: AddRoleComponent },

      { path: 'Users', component: UserManagementComponent },
      { path: 'Users/add-user', component: AddUserComponent },

      { path: 'official-holiday', component: OfficialHolidayComponent },
      {
        path: 'official-holiday/edit/:id',
        component: EditOfficialHolidayComponent,
      },
      { path: 'general-setting', component: GeneralSettingComponent },
    ],
  },
];

// loadChildren: () =>
//           import(
//             './components/Reports/SalaryReport/SalaryReport.component'
//           ).then((m) => m.SalaryReportComponent),
