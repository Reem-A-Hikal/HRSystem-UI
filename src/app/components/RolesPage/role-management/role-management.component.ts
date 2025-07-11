import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/Auth.service';


@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
})
export class RoleManagementComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  isLoading: boolean = false;

  roles: any[] = [];

  constructor(private router: Router, private roleService: RoleService,  public authService: AuthService) {}

 ngOnInit() {
  this.roleService.getRoles().subscribe((data) => {
    this.roles = data;
  });
}
get filteredRoles() {
  return this.roles
    .filter(role => role.name !== 'HR' && role.name !== 'User')  
    .filter(role =>
      role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
}


  get paginatedRoles() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRoles.slice(start, start + this.pageSize);
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.filteredRoles.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }

  goToAddPage() {
    this.roleService.clearEditingRole(); 
    this.router.navigate(['/dashboard/Roles/manageRole']);
  }

editRole(index: number) {
  const role = this.paginatedRoles[index];

  this.roleService.getRoleById(role.id).subscribe((fullRoleData) => {
    this.roleService.setEditingRole(fullRoleData);
    this.router.navigate(['/dashboard/Roles/manageRole']);

  });
}


 deleteRole(index: number) {
  const role = this.paginatedRoles[index];
  const confirmed = confirm(`Are you sure you want to delete the role "${role.name}"?`);

  if (confirmed) {
    this.roleService.deleteRole(role.id).subscribe(() => {

      const globalIndex = this.roles.findIndex(r => r.id === role.id);
      if (globalIndex !== -1) {
        this.roles.splice(globalIndex, 1);
        const maxPage = Math.ceil(this.filteredRoles.length / this.pageSize);
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
        }
      }
    });
  }
}
get isEmpty(): boolean {
  return !this.isLoading && this.filteredRoles.length === 0;
}


}