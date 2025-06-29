import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';      
import { FormsModule } from '@angular/forms'; 
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
  
})
export class AddRoleComponent implements OnInit {
  isEditing: boolean = false;

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
  const editingRole = this.roleService.getEditingRole();


  const roleData: {
    id?: number;
    name: string;
    permissions: { module: string; view: boolean; edit: boolean; delete: boolean; add: boolean }[];
  } = {
    name: this.roleName,
    permissions: this.modules.map(m => ({
      module: m.name,
      view: m.permissions.view,
      edit: m.permissions.edit,
      delete: m.permissions.delete,
      add: m.permissions.add,
    })),
  };

  if (editingRole) {
    // لو في تعديل، نحفظ بنفس الـ ID
    roleData.id = editingRole.id;
    this.roleService.updateRole(roleData);
  } else {
    // إضافة جديدة
    this.roleService.addRole(roleData);
  }

  this.roleService.clearEditingRole(); // تنظيف بعد الحفظ
  this.router.navigate(['/dashboard/roles']);
}

  ngOnInit() {

  const editingRole = this.roleService.getEditingRole();

  if (editingRole) {
    this.roleName = editingRole.name;
    this.isEditing = true; // تعيين حالة التعديل

    // Reset default permissions first
    this.modules.forEach(module => {
      module.permissions = { view: false, edit: false, delete: false, add: false };
    });

    // Apply saved permissions
    if (editingRole.permissions) {
      for (const perm of editingRole.permissions) {
        const mod = this.modules.find(m => m.name === perm.module);
        if (mod) {
          mod.permissions = {
            view: perm.view || false,
            edit: perm.edit || false,
            delete: perm.delete || false,
            add: perm.add || false,
          };
        }
      }
    }
  }
}

}
