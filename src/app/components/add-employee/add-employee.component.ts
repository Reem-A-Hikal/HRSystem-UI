import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  step = 1;

  constructor(
    private fb: FormBuilder,
    // private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z ]+$'),
          ],
        ],
        gender: ['', Validators.required],
        nationality: ['', Validators.required],
        birthDate: [
          '',
          [
            Validators.required,
            this.noFutureDateValidator(),
            this.minAgeValidator(18),
          ],
        ],
        nationalId: [
          '',
          [Validators.required, Validators.pattern('^[23][0-9]{13}$')],
        ],
        address: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
        ],
        department: ['', Validators.required],
        baseSalary: [null, [Validators.required, Validators.min(7000)]],
        contractDate: ['', [Validators.required, this.noFutureDateValidator()]],
      },
      { validators: this.contractAfter18YearsValidator() }
    );

    // Re-check validation if birthDate or contractDate change
    this.employeeForm.get('birthDate')?.valueChanges.subscribe(() => {
      this.employeeForm.updateValueAndValidity();
    });
    this.employeeForm.get('contractDate')?.valueChanges.subscribe(() => {
      this.employeeForm.updateValueAndValidity();
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;
      const inputDate = new Date(value);
      const today = new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age < minAge ? { tooYoung: true } : null;
    };
  }

  contractAfter18YearsValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const birthDateValue = group.get('birthDate')?.value;
      const contractDateValue = group.get('contractDate')?.value;

      if (!birthDateValue || !contractDateValue) return null;

      const birthDate = new Date(birthDateValue);
      const contractDate = new Date(contractDateValue);

      if (contractDate < birthDate) {
        return { beforeBirth: true };
      }

      const minContractDate = new Date(birthDate);
      minContractDate.setFullYear(minContractDate.getFullYear() + 18);

      if (contractDate < minContractDate) {
        return { tooYoungAtContract: true };
      }

      return null;
    };
  }

  nextStep() {
    if (this.step === 1) {
      const step1Fields = [
        'name',
        'gender',
        'nationality',
        'birthDate',
        'nationalId',
      ];
      const step1Valid = step1Fields.every((field) => this.f[field].valid);
      if (step1Valid) {
        this.step = 2;
      } else {
        step1Fields.forEach((field) => this.f[field].markAsTouched());
      }
    }
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.router.navigate(['/dashboard/employees']);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
