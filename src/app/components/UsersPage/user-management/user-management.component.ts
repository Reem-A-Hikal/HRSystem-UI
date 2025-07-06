
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  isEditing: boolean = false;
  constructor(private router: Router, private userService: UserService) {}
  ngOnInit(): void {
  this.userService.getUsers().subscribe((data) => {
    this.users = data;
  });
}

editUser(user: any) {
  this.isEditing = true; 
  this.userService.setEditingUser(user); 
  this.router.navigate(['/dashboard/add-user']); 
}

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  users: any[] = [];

  get filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.userName.toLowerCase().includes(term) ||
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


  deleteUser(user: any) {
  const confirmed = confirm(`Are you sure you want to delete ${user.fullName}?`);
  if (confirmed) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.users = this.users.filter((u) => u.id !== user.id);

        const maxPage = Math.ceil(this.filteredUsers.length / this.pageSize);
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
        }
      },
      error: (err) => console.error('Error deleting user:', err),
    });
  }
}


  addUser() {
    console.log('Add new user clicked');
  }
}