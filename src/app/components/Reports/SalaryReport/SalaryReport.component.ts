import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/Auth.service';

export interface Employee {
  name: string;
  department: string;
  basicSalary: number;
  attendanceDays: number;
  absenceDays: number;
  overtimeHours: number;
  deductionHours: number;
  totalOvertime: number;
  totalDeduction: number;
  netSalary: number;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
@Component({
  selector: 'app-SalaryReport',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './SalaryReport.component.html',
  styleUrls: ['./SalaryReport.component.css'],
})
export class SalaryReportComponent implements OnInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  employees: Employee[] = [
    {
      name: 'Sophia Carter',
      department: 'Marketing',
      basicSalary: 5000,
      attendanceDays: 20,
      absenceDays: 2,
      overtimeHours: 10,
      deductionHours: 5,
      totalOvertime: 500,
      totalDeduction: 250,
      netSalary: 5250,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      basicSalary: 4500,
      attendanceDays: 22,
      absenceDays: 1,
      overtimeHours: 8,
      deductionHours: 3,
      totalOvertime: 400,
      totalDeduction: 150,
      netSalary: 4750,
    },
    // Add more employees as needed
  ];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  };
  filteredEmployees: Employee[] = [];
  pagedEmployees: Employee[] = [];
  SearchTerm: string = '';
  SelectedMonth: string = '';
  SelectedYear: string = '';
  isLoading: boolean = true;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.paginateEmployees();
  }

  get isEmpty(): boolean {
    return this.employees.length === 0;
  }

  applyFilters() {
    this.isLoading = true;
    // this.filteredEmployees = this.employees.filter((record) => {
    //   const matchesSearch =
    //     this.SearchTerm === '' ||
    //     record.name
    //       .toLowerCase()
    //       .includes(this.SearchTerm.toLowerCase());

    //   const month = this.SelectedMonth ? this.SelectedMonth : 'All';
    //   const year = this.SelectedYear ? this.SelectedYear : 'All';
    //   const matchesDate = month === 'All' || year === 'All' || record.date.includes (month) && record.date.includes(year);
      // Laterrrrrrrrrrrrrrr
    // });
    this.load();
  }

  resetFilters() {
    this.SearchTerm = '';
    this.SelectedMonth = '';
    this.SelectedYear = '';
    this.load();
  }

  load() {
    setTimeout(() => {
      this.pagination.currentPage = 1;
      this.paginateEmployees();
      this.isLoading = false;
      this.scrollToTableTop();
    }, 300);
  }

  paginateEmployees() {
    this.pagination.totalItems = this.employees.length;
    this.pagination.totalPages = Math.ceil(
      this.pagination.totalItems / this.pagination.itemsPerPage
    );
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    this.pagedEmployees = this.employees.slice(startIndex, endIndex);
  }
  onPageChange(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.paginateEmployees();
      this.scrollToTableTop();
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of pages to display
    if (this.pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = this.pagination.currentPage - half;
      let end = this.pagination.currentPage + half;
      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }
      if (end > this.pagination.totalPages) {
        end = this.pagination.totalPages;
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }
  private scrollToTableTop() {
    setTimeout(() => {
      this.tableContainer?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  editEmployee(employee: Employee) {
    // Implement edit functionality
    console.log('Editing:', employee);
  }

  printEmployee(employee: Employee) {
    // Implement print functionality
    console.log('Printing:', employee);
  }
}
