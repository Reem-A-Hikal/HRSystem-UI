import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class AddUserComponent implements OnInit {
  isEditing: boolean = false;
  roles: any[] = [];

  user = {
    fullName: '',
    username: '',
    role: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private roleService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.roles = this.roleService.getRoles();

    const editingUser = this.userService.getEditingUser();
    if (editingUser) {
      this.user = { ...editingUser };
      this.isEditing = true;
      // Optional: clear editing user after loading
      this.userService.clearEditingUser();
    }
  }

  onSubmit() {
    console.log('User submitted:', this.user);
    this.router.navigate(['/dashboard/users']);
  }
}
