import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class AddUserComponent implements OnInit {
    roles: any[] = [];

constructor(private router: Router, private roleService: RoleService) {}

  user = {
    fullName: '',
    username: '',
    role: '',
    email: '',
    password: '',
  };

    ngOnInit() {
    this.roles = this.roleService.getRoles();
  }

  onSubmit() {
    console.log('User submitted:', this.user);
    this.router.navigate(['/dashboard/users']);
  }
}
