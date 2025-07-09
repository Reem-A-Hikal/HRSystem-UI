import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IEmployee } from '../../../models/IEmployee';
import { EmployeeService } from '../../../services/Employee.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/Auth.service';


@Component({
  selector: 'app-employeesdata',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employeesdata.component.html',
  styleUrls: ['./employeesdata.component.css'],
})
export class EmployeesdataComponent implements OnInit {
  employees: IEmployee[] = [];
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  isLoading: boolean = false;
  pageSize: number = 5;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  get isEmpty(): boolean {
    return this.employees.length === 0;
  }

  get pagedEmployees(): IEmployee[] {
    const filtered = this.employees.filter((emp) =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get hasResults(): boolean {
    return this.pagedEmployees.length > 0;
  }

  get totalPages(): number[] {
    const filtered = this.employees.filter((emp) =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const pages = Math.ceil(filtered.length / this.itemsPerPage);
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  goToAddPage() {
    this.router.navigate(['/dashboard/add-employee']);
  }

  viewEmployeeDetails(id: string) {
    this.router.navigate([`/dashboard/view-employee/${id}`]);
  }

  editEmployee(id: string) {
    this.router.navigate([`/dashboard/edit-employee/${id}`]);
  }

  deleteEmployee(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4a739c',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#101518',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The employee has been deleted.',
              icon: 'success',
              confirmButtonColor: '#4a739c',
              customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'custom-swal-confirm',
              },
            });
            this.loadEmployees();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the employee.',
              icon: 'error',
              confirmButtonColor: '#4a739c',
              customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'custom-swal-confirm',
              },
            });
            console.error(err);
          },
        });
      }
    });
  }

  trackById(index: number, employee: IEmployee): string {
    return employee.id;
  }
}
