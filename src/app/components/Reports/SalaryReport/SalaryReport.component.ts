import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IEmployeeSalary, SalaryApiResponse } from '../../../models/IEmployeeSalary';
import { Pagination } from '../../../models/Pagination';
import { ReportService } from '../../../services/Report.service';
import { AuthService } from '../../../services/Auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-SalaryReport',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './SalaryReport.component.html',
  styleUrls: ['./SalaryReport.component.css'],
})

export class SalaryReportComponent implements OnInit {
  SearchTerm: string = '';
  SelectedMonth: number | null = null;
  SelectedYear: number | null = null;
  isLoading = false;
  isEmpty = false;
  months = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' },
];


  employees: any[] = [];
  // pagedEmployees: any[] = [];

  pagination = {
    pageIndex: 1,
    pageSize: 5,
    totalPages: 1,
    totalCount: 0
  };

  constructor(
    private salaryService: ReportService, // Assuming ReportService is the service to fetch salary reports
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

    ngOnInit(): void {
    const today = new Date();
    this.SelectedMonth = today.getMonth() + 1;
    this.SelectedYear = today.getFullYear();
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    this.salaryService
      .getSalaryReports(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.SearchTerm,
        this.SelectedMonth,
        this.SelectedYear
      )
      .subscribe({
        next: (response: SalaryApiResponse) => {
          this.employees = response.items || [];
          this.pagination.totalCount = response.totalItems || 0;
          this.pagination.totalPages = response.totalPages || 1;
          this.pagination.pageSize = response.pageSize || 5;
          this.pagination.pageIndex = response.pageIndex || 1;
          this.isEmpty = this.employees.length === 0;
          this.isLoading = false;
          console.log(this.employees);
        },
        error: () => {
          this.employees = [];
          this.isEmpty = true;
          this.isLoading = false;
          this.toastr.error(
            'There was no salary data for this name, month, or year.',
            'Error'
          );
        },
      });
  }

  resetFilters(): void {
    this.SearchTerm = '';
    this.SelectedMonth = null;
    this.SelectedYear = null;
    this.pagination.pageIndex = 1; // reset page
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.pageIndex = page;
      this.applyFilters(); // re-fetch data from server
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }
}
