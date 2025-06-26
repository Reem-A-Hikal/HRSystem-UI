import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(public formBuilder: FormBuilder, private toastr: ToastrService) {}

  ngOnInit() {
    this.FormValidation();
  }
  FormValidation() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // hasError(controlName: string): Boolean {
  //   const control = this.loginForm.get(controlName);
  //   if (!control) return false;

  //   return (
  //     !!control?.invalid &&
  //     (this.isSubmitted || control?.touched || control?.dirty)
  //   );
  // }

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
    // console.log(this.loginForm.value, this.loginForm.controls);
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Validation Error'
      );
      return;
    }
    this.toastr.success('Login successful!', 'Success');
    console.log('Login successful', this.loginForm.value);
    // Reset the form after successful submission
    this.loginForm.reset();
    this.isSubmitted = false;
    this.showPassword = false;
  }
}
