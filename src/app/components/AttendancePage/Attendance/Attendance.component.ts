import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttendanceService } from '../../../services/Attendance.service';
import { AttendanceRecord } from '../../../models/IAttendance';
import { Pagination } from '../../../models/Pagination';
import { ToastrService } from '../../../services/Toastr.service';
import { ExportService } from '../../../services/Export.service';

@Component({
  selector: 'app-Attendance',
  imports: [RouterModule, CommonModule, FormsModule, BsDatepickerModule],
  templateUrl: './Attendance.component.html',
  styleUrls: ['./Attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  @ViewChild('tablecontainer') tableContainer!: ElementRef;
  isLoading: boolean = false;

  filteredList: AttendanceRecord[] = [];
  pagination: Pagination = {
    pageIndex: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  searchTerm: string = '';
  startDate?: Date;
  endDate?: Date;

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.loadAttendances();
  }

  trackByRecordId(index: number, record: AttendanceRecord): number | null {
    return record.id ?? null;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  loadAttendances() {
    this.isLoading = true;
    this.filteredList = [];

    this.attendanceService
      .getPaginated(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.searchTerm?.trim(),
        this.startDate,
        this.endDate
      )
      .subscribe(
        (response) => {
          this.filteredList = response.items;
          this.pagination.totalItems = response.totalItems;
          this.pagination.totalPages = response.totalPages;

          this.isLoading = false;
          // console.log(this.filteredList);
        },
        (error) => {
          this.isLoading = false;
          // console.log('Failed to load attendance records', error);
          if (error.status === 404) {
            const errorMsg = error.error?.error || 'No matching records found';
            this.toastr.onError(errorMsg);
            this.filteredList.length = 0;
          } else {
            this.toastr.onError('An error occurred while loading data');
          }
        }
      );
  }

  get isEmpty(): boolean {
    return this.filteredList.length === 0;
  }

  private isValidFilters(): boolean {
    if (!this.searchTerm && (!this.startDate || !this.endDate)) {
      this.toastr.onError('Please enter employee name or select a date range');
      return false;
    }
    if (this.searchTerm && this.searchTerm.trim().length < 3) {
      this.toastr.onError('Please enter a valid name (at least 3 characters)');
      return false;
    }
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.toastr.onError('Start date cannot be after end date');
      return false;
    }
    return true;
  }

  applyFilters() {
    this.isLoading = true;
    if (!this.isValidFilters()) {
      this.isLoading = false;
      return;
    }
    this.load();
  }

  resetFilters() {
    this.searchTerm = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.load();
  }

  load() {
    setTimeout(() => {
      this.pagination.pageIndex = 1;
      this.loadAttendances();
      this.isLoading = false;
      this.scrollToTableTop();
    }, 300);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.pageIndex = page;
      this.loadAttendances();
      this.scrollToTableTop();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 3; // Maximum number of pages to display
    const { pageIndex, totalPages } = this.pagination;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = pageIndex - half;
      let end = pageIndex + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
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

  // Function to handle delete action
  async onDelete(id: number | null) {
    const Swal = await import('sweetalert2');

    const result = await Swal.default.fire({
      title: `Are you sure?`,
      text: `You are about to delete this attendance record.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      this.attendanceService.deleteAttendance(id).subscribe({
        next: () => {
          Swal.default.fire({
            title: 'Deleted!',
            text: 'The attendance record has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          this.loadAttendances();
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.default.fire({
            title: 'Error!',
            text: 'Failed to delete attendance record.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }
  exportAllAttendanceToExcel(): void {
    this.attendanceService
      .getAllFilteredAttendances(this.searchTerm, this.startDate, this.endDate)
      .subscribe({
        next: (response) => {
          // console.log('Exporting all attendance records', response);
          this.exportService.exportToExcel(
            response,
            `Attendance Records - ${new Date().toLocaleDateString('en-US')}`
          );
          this.toastr.onSuccess('Attendance records exported successfully');
        },
        error: (error) => {
          // console.error('Failed to load all attendance records', error);
          this.toastr.onError('An error occurred while loading all records');
        },
      });
  }
  exportAllAttendanceToPDF(): void {
    this.attendanceService
      .getAllFilteredAttendances(this.searchTerm, this.startDate, this.endDate)
      .subscribe({
        next: (response) => {
          this.exportService.exportToPDF(response);
          this.toastr.onSuccess('Exported to PDF successfully');
        },
        error: () => {
          this.toastr.onError('Failed to export to PDF');
        },
      });
  }
}
