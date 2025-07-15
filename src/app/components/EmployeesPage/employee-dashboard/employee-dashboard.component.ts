import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth.service';
import { EmployeeService } from '../../../services/Employee.service';
import { ReportService } from '../../../services/Report.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEmployee } from '../../../models/IEmployee';
import { IEmployeeSalary, SalaryApiResponse } from '../../../models/IEmployeeSalary';
import { ToastrService } from 'ngx-toastr';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  department: string;
  gender: string;
  nationality: string;
  birthDate: Date;
  nationalId: string;
  baseSalary: number;
  contractDate: Date;
  startTime: Date;
  endTime: Date;
}


@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit {
  
  // Employee data
  employee: IEmployee | null = null;

  // Loading states
  isLoadingSalary: boolean = false;
  isLoadingEmployee: boolean = false;

  SelectedMonth :number=0;
  SelectedYear :number=0;
  
   employees: IEmployeeSalary[] = [];
  
  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private salaryService: ReportService,
    private toaster:ToastrService 
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.SelectedMonth = today.getMonth() + 1; 
    this.SelectedYear = today.getFullYear();
    this.loadEmployeeData();
    this.loadSalaryData();
    console.log('Employee Dashboard initialized');
  }

  // Load employee information
  loadEmployeeData(): void {
    this.isLoadingEmployee = true;
    
    // Get current user's employee ID from auth service
    const employeeId = this.authService.getCurrentUserId();
    console.log('Current Employee Full Name:', employeeId);
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (employee) => {
          this.employee = employee;
          this.isLoadingEmployee = false;
        },
        error: (error) => {
          console.error('Error loading employee data:', error);
          this.isLoadingEmployee = false;
        }
      });
    }
  }

  // Load salary data
  loadSalaryData(): void {
    this.isLoadingSalary = true;

    this.salaryService
        .getSalaryReports(
          1,
          5,
          this.authService.getCurrentUserFullName(),
          this.SelectedMonth,
          this.SelectedYear
        )
        .subscribe({
          next: (response: SalaryApiResponse) => {
            this.employees = response.items || [];
            console.log(this.employees[0].absentDays);
            this.isLoadingSalary = false;
          },
          error: () => {
            this.employees = [];
            this.isLoadingSalary = false;
            this.toaster.warning(
              'There was no salary data for this month added yet.',
              'Warning'
            );
          },
        });
    
  }

  // Refresh salary data
  refreshSalaryData(): void {
    this.loadSalaryData();
  }
}