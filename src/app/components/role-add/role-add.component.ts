import { Component } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';      
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
  
})
export class AddRoleComponent {
  roleName = '';
  modules = [
    { name: 'Permissions', permissions: { view: false, edit: false, delete: false, add: false } },
    { name: 'Users', permissions: { view: false, edit: false, delete: false, add: false } },
    { name: 'Employees', permissions: { view: false, edit: false, delete: false, add: false } },
    { name: 'Payroll', permissions: { view: false, edit: false, delete: false, add: false } },
    { name: 'Time Off', permissions: { view: false, edit: false, delete: false, add: false } },
    { name: 'Departments', permissions: { view: false, edit: false, delete: false, add: false } },
  ];

  constructor(private roleService: RoleService, private router: Router) {}

  saveRole() {
    const newRole = {
      name: this.roleName,
      permissions: this.modules.map(m => ({
        module: m.name,
        ...m.permissions,
      })),
    };

    this.roleService.addRole(newRole);
    this.router.navigate(['/dashboard/roles']);
  }
}
