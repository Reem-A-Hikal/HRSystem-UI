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
import { EmployeeService } from '../../../services/Employee.service';
import { ToastrService } from 'ngx-toastr';
import { ICreateEmployeeRequest } from '../../../models/IEmployee';
import { countries } from 'countries-list';
import { AuthService } from '../../../services/Auth.service';

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

  departments: { id: number; name: string }[] = [];
  nationalities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empService: EmployeeService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.nationalities = Object.values(countries)
      .map((c) => c.name)
      .sort();

    this.employeeForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z ]+$'),
          ],
        ],
        gender: ['', Validators.required],
        nationality: ['', Validators.required],
        dateOfBirth: [
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
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        address: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
        ],
        departmentId: [null, Validators.required],
        salary: [null, [Validators.required, Validators.min(7000)]],
        contractDate: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
      },
      {
        validators: [
          this.contractAfter18YearsValidator(),
          this.workingHoursMinimumValidator(8),
        ],
      }
    );

    this.loadDepartments();

    this.employeeForm.get('dateOfBirth')?.valueChanges.subscribe(() => {
      this.employeeForm.updateValueAndValidity();
    });
    this.employeeForm.get('contractDate')?.valueChanges.subscribe(() => {
      this.employeeForm.updateValueAndValidity();
    });
  }

  loadDepartments() {
    this.empService.getDepartments().subscribe({
      next: (res) => {
        console.log('Loaded Departments:', res);
        this.departments = res;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      },
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
      const birthDateValue = group.get('dateOfBirth')?.value;
      const contractDateControl = group.get('contractDate');
      const contractDateValue = contractDateControl?.value;

      if (!birthDateValue || !contractDateValue) return null;

      const birthDate = new Date(birthDateValue);
      const contractDate = new Date(contractDateValue);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const errors: any = { ...(contractDateControl?.errors || {}) };

      if (contractDate > today) {
        errors.futureDate = true;
      }

      if (contractDate < birthDate) {
        errors.beforeBirth = true;
      }

      const minContractDate = new Date(birthDate);
      minContractDate.setFullYear(minContractDate.getFullYear() + 18);

      if (contractDate < minContractDate) {
        errors.tooYoungAtContract = true;
      }

      if (Object.keys(errors).length > 0) {
        contractDateControl?.setErrors(errors);
        return errors;
      } else {
        contractDateControl?.setErrors(null);
        return null;
      }
    };
  }

  workingHoursMinimumValidator(minHours: number): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const start = group.get('startTime')?.value;
      const end = group.get('endTime')?.value;

      if (!start || !end) return null;

      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      const diffMinutes = endMinutes - startMinutes;
      const diffHours = diffMinutes / 60;

      if (diffHours < minHours) {
        group.get('endTime')?.setErrors({ minWorkingHours: true });
        return { minWorkingHours: true };
      }

      group.get('endTime')?.setErrors(null);
      return null;
    };
  }

  goBack() {
    this.router.navigate(['/dashboard/Employees']);
  }

  nextStep() {
    if (this.step === 1) {
      const step1Fields = [
        'fullName',
        'gender',
        'nationality',
        'dateOfBirth',
        'nationalId',
        'email',
        'password',
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
      const payload: ICreateEmployeeRequest = {
        fullname: this.f['fullName'].value,
        departmentId: this.f['departmentId'].value,
        salary: this.f['salary'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        address: this.f['address'].value,
        phoneNumber: this.f['phoneNumber'].value,
        gender: this.f['gender'].value,
        nationality: this.f['nationality'].value,
        nationalId: this.f['nationalId'].value,
        dateOfBirth: this.f['dateOfBirth'].value || null,
        contractDate: this.f['contractDate'].value,
        startTime: `0001-01-01T${this.f['startTime'].value}:00`,
        endTime: `0001-01-01T${this.f['endTime'].value}:00`,
      };

      console.log('Payload:', payload);

      this.empService.createEmployee(payload).subscribe({
        next: (res) => {
          console.log('Employee Created!', res);
          this.toastr.success('Employee created successfully!', 'Success');

          // Navigate to view employee by returned id
          // this.router.navigate(['/dashboard/view-employee', res.employeeId]);
          this.router.navigate(['/dashboard/Employees']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error creating employee!', 'Error');
        },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
