import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: Boolean = false;
  showPassword: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.FormValidation();
  }
  FormValidation() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error(
        'Please fill in all required fields correctly.',
        'Validation Error'
      );
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      () => {
        this.toastr.success('Login successful', 'Success');
        this.loginForm.reset();
        this.isSubmitted = false;
        this.showPassword = false;
      },
      (error) => {
        this.toastr.error('Invalid credentials', 'Error');
        console.log(error);
      }
    );
  }
}
