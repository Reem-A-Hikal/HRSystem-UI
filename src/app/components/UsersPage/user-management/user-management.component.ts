import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 
import { UserService, User } from '../../../services/user.service'; 
import { AuthService } from '../../../services/Auth.service';

@Component({ 
  selector: 'app-user-management', 
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './user-management.component.html', 
  styleUrls: ['./user-management.component.css'], 
}) 
export class UserManagementComponent implements OnInit { 
  searchTerm: string = ''; 
  currentPage: number = 1; 
  pageSize: number = 5; 
  users: User[] = []; 
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router, 
    private userService: UserService,
    public authService: AuthService
  ) {} 

  ngOnInit(): void { 
    this.loadUsers();
  } 

  private loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

 editUser(user: any) {
  const userForEdit = {
    id: user.id,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    role: user.roles && user.roles.length > 0 ? user.roles[0] : '', 
    password: '' 
  };
  
  console.log('User data for editing:', userForEdit); 
  
  this.userService.setEditingUser(userForEdit);
  
  this.router.navigate(['/dashboard/add-user']);
}
  deleteUser(user: User) { 
    if (!user.id) {
      this.errorMessage = 'Invalid user ID';
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${user.fullName}؟`); 
    if (confirmed) { 
      this.userService.deleteUser(user.id).subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.successMessage = 'User deleted successfully';
          this.loadUsers(); 
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = error.error?.message || 'Failed to delete user';
        }
      });
    } 
  } 

  addUser() { 
    this.userService.clearEditingUser(); 
    this.router.navigate(['/dashboard/add-user']);
  } 

 get filteredUsers(): User[] {
  if (!this.searchTerm) {
    return this.users.filter(user => 
      !user.roles?.includes('HR') && !user.roles?.includes('User')
    );
  }

  const term = this.searchTerm.toLowerCase();
  return this.users.filter(user =>
    (
      user.fullName.toLowerCase().includes(term) ||
      user.userName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.roles && user.roles.some(role => role.toLowerCase().includes(term)))
    ) &&
    !user.roles?.includes('HR') &&
    !user.roles?.includes('User')
  );
}


  get paginatedUsers(): User[] { 
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

  onSearchChange() {
    this.currentPage = 1; 
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  refreshUsers() {
    this.clearMessages();
    this.loadUsers();
  }
}