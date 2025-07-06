import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

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

user = {
  id: '',
  fullName: '',
  username: '',
  role: '',
  email: '',
  password: ''
};



  constructor(
    private router: Router,
    private roleService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit() {
  this.roleService.getRoles().subscribe((data) => {
  this.roles = data;
});
    const editingUser = this.userService.getEditingUser();
    if (editingUser) {
      this.user = { ...editingUser };
      this.isEditing = true;
      // Optional: clear editing user after loading
      this.userService.clearEditingUser();
    }
  }

  onSubmit() {
  if (this.isEditing) {
    this.userService.updateUser(this.user).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.router.navigate(['/dashboard/Users']); 
      },
      error: (err) => console.error('Error updating user:', err.error),
    });
  } else {
    this.userService.addUser(this.user).subscribe({
      next: (res) => {
        console.log('User added successfully:', res);

        const roleBody = { roleName: this.user.role };

       this.userService.assignRole(res.userId, this.user.role).subscribe({
        next: () => {
          console.log("Role assigned successfully");
          this.router.navigate(['/dashboard/Users']);
        },
        error: (err) => console.error("Error assigning role:", err.error),
      });

      },
      error: (err) => console.error('Error adding user:', err.error),
    });
  }
}


}