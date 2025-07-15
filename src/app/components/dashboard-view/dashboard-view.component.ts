import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/Dashboard.service';

import {
  ITotalEmployees,
  IEmployeesByDepartment,
  IGenderDistribution,
  IAgeGroup,
  INationalityDistribution,
  IAverageDailyAttendance,
  IAverageSalary,
} from '../../models/IDashboard';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DecimalPipe],
  standalone: true,
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements OnInit {
  totalEmployees?: number;
  employeesByDepartment: IEmployeesByDepartment[] = [];
  genderDistribution: IGenderDistribution[] = [];
  ageGroups: IAgeGroup[] = [];
  nationalityDistribution: INationalityDistribution[] = [];
  dailyAttendance?: number;
  averageSalary?: number;

  constructor(private dashboardService: DashboardService, public Authser:AuthService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getTotalEmployees().subscribe((res) => {
      this.totalEmployees = res.totalEmployees;
    });

    this.dashboardService
      .getEmployeesByDepartmentDashboard()
      .subscribe((res) => {
        this.employeesByDepartment = res;
      });

    this.dashboardService.getGenderDistribution().subscribe((res) => {
      this.genderDistribution = res;
    });

    this.dashboardService.getAgeGroups().subscribe((res) => {
      this.ageGroups = res;
    });

    this.dashboardService.getNationalityDistribution().subscribe((res) => {
      this.nationalityDistribution = res;
    });

    this.dashboardService.getDailyAttendance().subscribe((res) => {
      this.dailyAttendance = res.dailyAttendance;
    });

    this.dashboardService.getAverageSalary().subscribe((res) => {
      this.averageSalary = res.averageSalary;
    });
  }
}
