import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent {
  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Intern' },
    // { id: 5, name: 'Contractor' },
    // { id: 6, name: 'Consultant' },
    // { id: 7, name: 'Temporary' },
    // { id: 8, name: 'Part-time' },
    // { id: 9, name: 'Freelancer' },
    // { id: 10, name: 'Team Lead' },
  ];
}
