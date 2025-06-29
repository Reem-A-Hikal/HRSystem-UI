import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EmployeesdataComponent } from './components/employeesdata/employeesdata.component';
import { AttendanceComponent } from './components/AttendancePage/Attendance/Attendance.component';
import { SalaryReportComponent } from './components/Reports/SalaryReport/SalaryReport.component';
import { EditRecordComponent } from './components/Reports/editRecord/editRecord.component';
import { ManageAttendanceComponent } from './components/AttendancePage/manageAttendance/manageAttendance.component';
import { PrintReportComponent } from './components/Reports/PrintReport/PrintReport.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'Roles', component: RoleManagementComponent },
      { path: 'Employees', component: EmployeesdataComponent },
      { path: 'Attendance', component: AttendanceComponent },
      { path: 'ManageAttendance', component: ManageAttendanceComponent },
      { path: 'ManageAttendance/:id', component: ManageAttendanceComponent },
      {
        path: 'SalaryReport',
        component: SalaryReportComponent,
      },
      { path: 'EditRecord', component: EditRecordComponent },
      { path: 'PrintReport', component: PrintReportComponent },
    ],
  },
];

// loadChildren: () =>
//           import(
//             './components/Reports/SalaryReport/SalaryReport.component'
//           ).then((m) => m.SalaryReportComponent),
