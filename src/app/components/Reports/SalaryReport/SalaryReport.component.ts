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
// export class SalaryReportComponent implements OnInit {
//   @ViewChild('tableContainer') tableContainer!: ElementRef;

//   pagedEmployees: IEmployeeSalary[] = [];

//   pagination: Pagination = {
//     pageIndex: 1,
//     pageSize: 5,
//     totalItems: 0,
//     totalPages: 0,
//     hasNextPage: false,
//     hasPreviousPage: false,
//   };

//   SearchTerm: string = '';
//   SelectedMonth: string = '';
//   SelectedYear: string = '';
//   isLoading: boolean = false;

//   constructor(private salaryService: ReportService, public authService: AuthService) {}

//   ngOnInit() {
//     this.load();
//   }

//   get isEmpty(): boolean {
//     return this.pagedEmployees.length === 0;
//   }

//   load() {
//     this.isLoading = true;
//     this.salaryService.getSalaryReports(this.pagination.pageIndex, this.pagination.pageSize).subscribe({
//       next: (response) => {
//         this.pagedEmployees = response.items;
//         this.pagination = {
//           pageIndex: response.pageIndex,
//           pageSize: response.pageSize,
//           totalItems: response.totalItems,
//           totalPages: response.totalPages,
//           hasNextPage: response.hasNextPage,
//           hasPreviousPage: response.hasPreviousPage,
//         };
//         this.isLoading = false;
//         this.scrollToTableTop();
//         console.log('Salary data loaded successfully:', this.pagedEmployees);
//       },
//       error: (err) => {
//         console.error('Failed to load salary data:', err);
//         this.isLoading = false;
//       },
//     });
//   }

//   onPageChange(page: number) {
//     if (page >= 1 && page <= this.pagination.totalPages) {
//       this.pagination.pageIndex = page;
//       this.load();
//     }
//   }

//   getPages(): number[] {
//     const pages = [];
//     const maxVisiblePages = 5;
//     if (this.pagination.totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= this.pagination.totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const half = Math.floor(maxVisiblePages / 2);
//       let start = this.pagination.pageIndex - half;
//       let end = this.pagination.pageIndex + half;
//       if (start < 1) {
//         start = 1;
//         end = maxVisiblePages;
//       }
//       if (end > this.pagination.totalPages) {
//         end = this.pagination.totalPages;
//         start = Math.max(1, end - maxVisiblePages + 1);
//       }
//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }
//     return pages;
//   }

//   private scrollToTableTop() {
//     setTimeout(() => {
//       this.tableContainer?.nativeElement?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }, 0);
//   }

//   editEmployee(employee: IEmployeeSalary) {
//     console.log('Editing:', employee);
//   }

//   printEmployee(employee: IEmployeeSalary) {
//     console.log('Printing:', employee);
//   }
//   applyFilters() {
//     this.isLoading = true;
//     // Implement filtering logic here
//     this.load();
//   }
//   resetFilters() {
//     this.SearchTerm = '';
//     this.SelectedMonth = '';
//     this.SelectedYear = '';
//     this.load();
//   }

// }

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
  pagedEmployees: any[] = [];

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
    this.SelectedMonth = today.getMonth() + 1; // JavaScript months are 0-based
    this.SelectedYear = today.getFullYear();
    this.applyFilters();
  }

  // applyFilters(): void {
  //   this.isLoading = true;
  //   this.salaryService
  //     .getSalaryReports(this.pagination.pageIndex,this.pagination.pageSize,this.SearchTerm, this.SelectedMonth, this.SelectedYear)
  //     .subscribe({
  //       next: (response: SalaryApiResponse) => {
  //         this.employees = response.items || [];
  //         this.pagination.totalCount = response.totalItems || 0;
  //         this.pagination.totalPages = response.totalPages || 1;
  //         this.pagination.pageSize = response.pageSize || 5;
  //         this.pagination.pageIndex = response.pageIndex || 1;
  //         this.setPagedEmployees();
  //         this.isEmpty = this.employees.length === 0;
  //         this.isLoading = false;
  //       },
  //       error: () => {
  //           this.toastr.error(
  //             'there was no salary data for this name or month or year',
  //             'Error'
  //           );
  //           this.isLoading = false;
  //           this.employees = [];
  //         }
  //     });
  //     // .subscribe((response: SalaryApiResponse) => {
  //     //   this.employees = response.items || [];
  //     //   this.pagination.totalCount = response.totalItems || 0;
  //     //   this.pagination.totalPages = response.totalPages || 1;
  //     //   this.pagination.pageSize = response.pageSize || 5;
  //     //   this.pagination.pageIndex = response.pageIndex || 1;
  //     //   this.setPagedEmployees();
  //     //   this.isEmpty = this.employees.length === 0;
  //     //   this.isLoading = false;
  //     //   console.log('Employees loaded:', this.employees);
  //     // });
  // }

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
        this.setPagedEmployees();
        this.isLoading = false;
      },
      error: () => {
        this.employees = [];
        this.pagedEmployees = [];
        this.isEmpty = true; // <-- make sure this is true so "noData" ng-template shows
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
    this.applyFilters();
  }

  setPagedEmployees(): void {
    const start = (this.pagination.pageIndex - 1) * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    this.pagedEmployees = this.employees.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.pageIndex = page;
      this.setPagedEmployees();
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }

  editEmployee(employee: any): void {
    console.log('Edit', employee);
    // Navigation or modal logic here
  }

  printEmployee(employee: any): void {
    console.log('Print', employee);
    // Print logic here
  }
}
