import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IEmployee } from '../../../models/IEmployee';

@Component({
  selector: 'app-employeesdata',
  imports: [CommonModule, FormsModule],
  templateUrl: './employeesdata.component.html',
  styleUrls: ['./employeesdata.component.css'],
})
export class EmployeesdataComponent {
  employees: IEmployee[] = [
    {
      id: 1,
      name: 'Sophia Carter',
      department: 'Marketing',
      salary: '$65,000',
      address: '123 Elm Street, Anytown',
      phone: '555-1234',
      gender: 'Female',
      nationality: 'American',
      nationalId: '123-456-7890',
      dob: '1990-05-15',
      contractDate: '2022-01-10',
    },
  ];

  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private router: Router) {}

  get pagedEmployees(): IEmployee[] {
    const filtered = this.employees.filter((emp) =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
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

  editEmployee(id: number) {
    this.router.navigate([`/dashboard/edit-employee/${id}`]);
  }

  deleteEmployee(id: number) {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }
}
