import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface AttendanceRecord {
  id: number;
  department: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime: string;
  date: string;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
@Component({
  selector: 'app-Attendance',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './Attendance.component.html',
  styleUrls: ['./Attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  @ViewChild('tablecontainer') tableContainer!: ElementRef;
  attendanceList: AttendanceRecord[] = [
    {
      id: 1,
      department: 'Engineering',
      employeeName: 'Emily Carter',
      checkInTime: '09:00 AM',
      checkOutTime: '06:00 PM',
      date: '2024-07-26',
    },
    {
      id: 2,
      department: 'Marketing',
      employeeName: 'John Smith',
      checkInTime: '08:30 AM',
      checkOutTime: '05:30 PM',
      date: '2024-07-26',
    },
    {
      id: 3,
      department: 'HR',
      employeeName: 'Sarah Johnson',
      checkInTime: '09:15 AM',
      checkOutTime: '06:15 PM',
      date: '2024-07-26',
    },
    {
      id: 4,
      department: 'Finance',
      employeeName: 'Michael Brown',
      checkInTime: '08:45 AM',
      checkOutTime: '05:45 PM',
      date: '2024-07-26',
    },
    {
      id: 5,
      department: 'Operations',
      employeeName: 'Lisa Wilson',
      checkInTime: '09:00 AM',
      checkOutTime: '06:00 PM',
      date: '2024-07-26',
    },
    {
      id: 6,
      department: 'Engineering',
      employeeName: 'David Lee',
      checkInTime: '09:30 AM',
      checkOutTime: '06:30 PM',
      date: '2024-07-27',
    },
    {
      id: 7,
      department: 'Marketing',
      employeeName: 'Jennifer Davis',
      checkInTime: '08:45 AM',
      checkOutTime: '05:45 PM',
      date: '2024-07-27',
    },
  ];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  };
  filteredList: AttendanceRecord[] = [];
  pagedAttendance: AttendanceRecord[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  constructor() {}

  ngOnInit() {
    this.filteredList = [...this.attendanceList];
    this.paginateRecords();
  }

  get isEmpty(): boolean {
    return this.filteredList.length === 0;
  }

  applyFilters() {
    this.isLoading = true;
    this.filteredList = this.attendanceList.filter((record) => {
      const matchesSearch =
        this.searchTerm === '' ||
        record.employeeName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const recordDate = new Date(record.date);
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      const matchesDate =
        (!startDate || recordDate >= startDate) &&
        (!endDate || recordDate <= endDate);

      return matchesSearch && matchesDate;
    });
    this.load();
  }
  resetFilters() {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.filteredList = [...this.attendanceList];
    this.load();
  }

  load() {
    setTimeout(() => {
      this.pagination.currentPage = 1;
      this.paginateRecords();
      this.isLoading = false;
      this.scrollToTableTop();
    }, 300);
  }

  paginateRecords() {
    this.pagination.totalItems = this.filteredList.length;
    this.pagination.totalPages = Math.ceil(
      this.pagination.totalItems / this.pagination.itemsPerPage
    );
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    this.pagedAttendance = this.filteredList.slice(startIndex, endIndex);
  }
  onPageChange(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.paginateRecords();
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
  onEdit(record: AttendanceRecord) {
    console.log('Editing record:', record);
    // Implement your edit logic here
  }

  // Function to handle delete action
  onDelete(record: AttendanceRecord) {
    console.log('Deleting record:', record);
    if (
      confirm(
        `Are you sure you want to delete ${record.employeeName}'s attendance record?`
      )
    ) {
      this.attendanceList = this.attendanceList.filter(
        (item) => item !== record
      );
      this.applyFilters(); // Reapply filters after deletion
    }
  }

  exportToExcel() {
    console.log('Exporting to Excel');
    // Implement Excel export
  }

  exportToPDF() {
    console.log('Exporting to PDF');
    // Implement PDF export
  }
}
