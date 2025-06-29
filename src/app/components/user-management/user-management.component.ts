import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  isEditing: boolean = false;
  constructor(private router: Router, private userService: UserService) {}

  editUser(user: any) {
    this.isEditing
    this.userService.setEditingUser(user);
    this.router.navigate(['/dashboard/add-user']);
  }
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  users = [
    { fullName: 'Sophia Clark', username: 'sophia.clark', email: 'sophia.clark@example.com', role: 'Manager' },
    { fullName: 'Liam Walker', username: 'liam.walker', email: 'liam.walker@example.com', role: 'Developer' },
    { fullName: 'Olivia Carter', username: 'olivia.carter', email: 'olivia.carter@example.com', role: 'Designer' },
    { fullName: 'Noah Hayes', username: 'noah.hayes', email: 'noah.hayes@example.com', role: 'Analyst' },
    { fullName: 'Ava Bennett', username: 'ava.bennett', email: 'ava.bennett@example.com', role: 'HR Specialist' },
    { fullName: 'Ethan Reed', username: 'ethan.reed', email: 'ethan.reed@example.com', role: 'Sales Rep' },
    { fullName: 'Isabella Morgan', username: 'isabella.morgan', email: 'isabella.morgan@example.com', role: 'Marketing Coordinator' },
    { fullName: 'Jackson Cooper', username: 'jackson.cooper', email: 'jackson.cooper@example.com', role: 'IT Support' },
    { fullName: 'Mia Foster', username: 'mia.foster', email: 'mia.foster@example.com', role: 'Project Manager' },
    { fullName: 'Aiden Hughes', username: 'aiden.hughes', email: 'aiden.hughes@example.com', role: 'Customer Service' },
  ];

  get filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.filteredUsers.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }

  // Removed duplicate editUser method to fix duplicate implementation error

  deleteUser(user: any) {
    const confirmed = confirm(`Are you sure you want to delete ${user.fullName}?`);
    if (confirmed) {
      this.users = this.users.filter(u => u !== user);
      const maxPage = Math.ceil(this.filteredUsers.length / this.pageSize);
      if (this.currentPage > maxPage) {
        this.currentPage = maxPage;
      }
    }
  }

  addUser() {
    console.log('Add new user clicked');
    // يمكنك التنقل لصفحة الإضافة هنا
  }
}
