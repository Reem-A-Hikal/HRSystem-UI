import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';      
import { FormsModule } from '@angular/forms'; 
import { RoleService } from '../../../services/role.service';
import { PermissionService } from '../../../services/permission.service';
import { AuthService } from '../../../services/Auth.service';


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
  
  permissions: any[] = []; 
  selectedPermissions: Set<number> = new Set(); 

  constructor(
    private roleService: RoleService,
    private router: Router,
    private permissionService: PermissionService,
    public authService: AuthService
  ) {}

ngOnInit() {
  const editingRole = this.roleService.getEditingRole();

  this.permissionService.getAllPermissions().subscribe((data: any[]) => {
    if (editingRole) {
      this.roleName = editingRole.name;
      this.isEditing = true;

      this.permissions = data.map((perm) => {
        const matched = editingRole.permissions.find((p: any) => p.page === perm.page);
        return {
          ...perm,
          isView: matched?.isView || false,
          isAdd: matched?.isAdd || false,
          isEdit: matched?.isEdit || false,
          isDelete: matched?.isDelete || false,
        };
      });
    } else {
      this.isEditing = false;
      this.roleName = '';

      this.permissions = data.map((perm) => ({
        ...perm,
        isView: false,
        isAdd: false,
        isEdit: false,
        isDelete: false,
      }));
    }
  });
}


  getModules(): string[] {
    const uniqueModules = new Set(this.permissions.map(p => p.page));
    return Array.from(uniqueModules);
  }

 isPermissionSelected(page: string, action: string): boolean {
  const perm = this.permissions.find(p => p.page === page);
  if (!perm) return false;

  switch (action) {
    case 'View':
      return perm.isView;
    case 'Add':
      return perm.isAdd;
    case 'Edit':
      return perm.isEdit;
    case 'Delete':
      return perm.isDelete;
    default:
      return false;
  }
}


 togglePermission(page: string, action: string, event: any) {
  const perm = this.permissions.find(p => p.page === page);
  if (!perm) return;

  switch (action) {
    case 'View':
      perm.isView = event.target.checked;
      break;
    case 'Add':
      perm.isAdd = event.target.checked;
      break;
    case 'Edit':
      perm.isEdit = event.target.checked;
      break;
    case 'Delete':
      perm.isDelete = event.target.checked;
      break;
  }
}


saveRole() {
  const modules = this.getModules();

  const permissionPayload = modules.map(module => {
    return {
      page: module,
      isView: this.isPermissionSelected(module, 'View'),
      isAdd: this.isPermissionSelected(module, 'Add'),
      isEdit: this.isPermissionSelected(module, 'Edit'),
      isDelete: this.isPermissionSelected(module, 'Delete'),
    };
  });

  const roleData = {
    roleName: this.roleName,
    permissions: permissionPayload
  };

  console.log('Sending Role:', roleData);

  const editingRole = this.roleService.getEditingRole();

  if (editingRole) {
    this.roleService.updateRole({ ...roleData, id: editingRole.id }).subscribe(() => {
      this.router.navigate(['/dashboard/Roles']);
    });
  } else {
    this.roleService.addRole(roleData).subscribe(() => {
      this.router.navigate(['/dashboard/Roles']);
    });
  }

  this.roleService.clearEditingRole();
}



}