import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IEmployee } from '../../../models/IEmployee';
import { EmployeeService } from '../../../services/Employee.service';

@Component({
  selector: 'app-view-employee',
  imports: [CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent implements OnInit {
  employeeId!: string;
  employee!: IEmployee;

  constructor(
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.empService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        if (emp) {
          this.employee = emp;
        } else {
          console.log('Employee not found!');
          this.router.navigate(['/dashboard/Employees']);
        }
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.router.navigate(['/dashboard/Employees']);
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/Employees']);
  }
}
