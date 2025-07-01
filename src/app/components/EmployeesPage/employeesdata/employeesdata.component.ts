import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IEmployee } from '../../../models/IEmployee';
import { EmployeeService } from '../../../services/Employee.service';

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
    private employeeService: EmployeeService
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
      emp.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get hasResults(): boolean {
    return this.pagedEmployees.length > 0;
  }

  get totalPages(): number[] {
    const filtered = this.employees.filter((emp) =>
      emp.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  viewEmployeeDetails(id: number) {
    this.router.navigate([`/dashboard/view-employee/${id}`]);
  }

  editEmployee(id: number) {
    this.router.navigate([`/dashboard/edit-employee/${id}`]);
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Employee deleted!');
        this.loadEmployees();
      },
      error: (err) => console.error(err),
    });
  }

  trackById(index: number, employee: IEmployee): number {
    return employee.id;
  }
}
