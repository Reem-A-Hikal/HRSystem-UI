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
import { EmployeeService } from '../../../services/Employee.service';
import { ToastrService } from 'ngx-toastr';

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
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private toastr: ToastrService
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
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
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
        contractDate: ['', [Validators.required, this.noFutureDateValidator()]],
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

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.empService.getEmployeeById(this.employeeId).subscribe({
          next: (emp) => {
            this.employeeForm.patchValue(emp);
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.empService
        .updateEmployee(this.employeeId, this.employeeForm.value)
        .subscribe({
          next: (res) => {
            console.log('Employee updated:', res);
            this.toastr.success('Employee updated successfully!', 'Success');
            this.router.navigate(['/dashboard/Employees']);
          },
          error: (err) => {
            console.error(err);
          },
        });
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
}
