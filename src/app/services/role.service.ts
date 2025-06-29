import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Intern' },
    { id: 5, name: 'Contractor' },
    { id: 6, name: 'Consultant' },
    { id: 7, name: 'Temporary' },
    { id: 8, name: 'Part-time' },
    { id: 9, name: 'Freelancer' },
    { id: 10, name: 'Team Lead' },
  ];

  private editingRole: any = null;

  getRoles() {
    return this.roles;
  }

  addRole(role: any) {
    const newId = Math.max(...this.roles.map(r => r.id), 0) + 1;
    this.roles.push({ ...role, id: newId });
  }

  updateRole(updatedRole: any) {
    const index = this.roles.findIndex(r => r.id === updatedRole.id);
    if (index !== -1) this.roles[index] = updatedRole;
  }

  setEditingRole(role: any) {
    this.editingRole = role;
  }

  getEditingRole() {
    return this.editingRole;
  }

  clearEditingRole() {
    this.editingRole = null;
  }
}
