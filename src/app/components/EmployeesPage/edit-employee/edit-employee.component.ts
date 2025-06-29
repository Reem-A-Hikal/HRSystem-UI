import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  step = 1;
  employee: any;
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize the form first
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
        baseSalary: [
          null,
          [Validators.required, Validators.min(7000), Validators.max(100000)],
        ],
        contractDate: [
          '',
          [
            Validators.required,
            this.noFutureDateValidator(),
            this.contractAfter18YearsValidator(),
          ],
        ],
      },
      { validators: this.contractAfter18YearsValidator() }
    );

    // Get ID from route and load employee data
    this.route.paramMap.subscribe(
      (params: import('@angular/router').ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.employeeId = +id;
          this.loadEmployeeData(this.employeeId);
        }
      }
    );
  }

  loadEmployeeData(id: number) {
    // Example static data - replace with API call later
    this.employee = {
      id: id,
      name: 'John Doe',
      gender: 'male',
      nationality: 'egyptian',
      birthDate: '1990-05-10',
      nationalId: '23456789012345',
      address: '123 Main St',
      phone: '01012345678',
      department: 'IT',
      baseSalary: 10000,
      contractDate: '2022-01-01',
    };

    this.employeeForm.patchValue(this.employee);
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

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Updated Employee:', this.employeeForm.value);
      this.router.navigate(['/dashboard/employees']);
    } else {
      this.employeeForm.markAllAsTouched();
    }
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

  get f() {
    return this.employeeForm.controls;
  }
}
