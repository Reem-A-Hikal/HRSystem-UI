import { Component, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RoleService } from '../../../services/role.service'; 
import { UserService, User } from '../../../services/user.service'; 
import { AuthService } from '../../../services/Auth.service';

@Component({ 
  selector: 'app-add-user', 
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './user-add.component.html', 
  styleUrls: ['./user-add.component.css'], 
}) 
export class AddUserComponent implements OnInit { 
  isEditing: boolean = false; 
  roles: any[] = []; 
  user: User = { 
    fullName: '', 
    userName: '', 
    role: '', 
    email: '', 
    password: '', 
  }; 
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor( 
    private router: Router, 
    private roleService: RoleService, 
    private userService: UserService ,
    public authService: AuthService,
  ) {} 

  ngOnInit() { 
    this.loadRoles();
    this.loadEditingUser();
  } 

  private loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles';
      }
    });
  }

  private loadEditingUser() {
    const editingUser = this.userService.getEditingUser(); 
    if (editingUser) { 
      this.user = { ...editingUser }; 
      this.isEditing = true; 
      this.userService.clearEditingUser(); 
    } 
  }

  onSubmit() { 
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing && this.user.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private validateForm(): boolean {
    if (!this.user.fullName.trim()) {
      this.errorMessage = 'Full name required';
      return false;
    }
    if (!this.user.userName.trim()) {
      this.errorMessage = 'Username required';
      return false;
    }
    if (!this.user.email.trim()) {
      this.errorMessage = 'Email required';
      return false;
    }
    if (!this.user.role.trim()) {
      this.errorMessage = 'Role required';
      return false;
    }
    if (!this.isEditing && !this.user.password?.trim()) {
      this.errorMessage = 'Password required';
      return false;
    }
    return true;
  }

  private createUser() {
    this.userService.addUser(this.user).subscribe({
      next: (response) => {
        console.log('User added successfully:', response);
        this.successMessage = 'User created successfully';
        setTimeout(() => {
          this.router.navigate(['/dashboard/Users']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.errorMessage = error.error?.message || 'Failed to create user';
        this.isSubmitting = false;
      }
    });
  }

  private updateUser() {
    if (!this.user.id) {
      this.errorMessage = 'User ID required for update';
      this.isSubmitting = false;
      return;
    }

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.successMessage = 'User updated successfully';
        setTimeout(() => {
          this.router.navigate(['/dashboard/Users']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.error?.message || 'Failed to update user';
        this.isSubmitting = false;
      }
    });
  }
get filteredRoles() {
  return this.roles.filter(r => r.name !== 'HR' && r.name !== 'User');
}
passwordVisible: boolean = false;

togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}


  onCancel() {
    this.router.navigate(['/dashboard/Users']);

  }
}