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
import { IUpdateEmployeeRequest, IEmployee } from '../../../models/IEmployee';
import { countries } from 'countries-list';
import { forkJoin } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  step = 1;
  employeeId!: string;
  isEditMode = true;

  departments: { id: number; name: string }[] = [];
  nationalities: string[] = [];

  private employeeData!: IEmployee;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private toastr: ToastrService
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
        password: ['', [Validators.minLength(6)]],
        address: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
        ],
        // departmentId: ['', Validators.required],
        departmentId: [null, Validators.required],

        salary: [
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
        this.employeeId = id;

        forkJoin({
          departments: this.empService.getDepartments(),
          employee: this.empService.getEmployeeById(id),
        }).subscribe({
          next: ({ departments, employee }) => {
            this.departments = departments;
            this.employeeData = employee;
            this.patchEmployeeForm(employee);
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    });
  }

  patchEmployeeForm(emp: IEmployee) {
    this.employeeForm.patchValue({
      fullName: emp.name || '',
      dateOfBirth: this.formatDate(emp.birthDate) ?? '',
      departmentId: this.getDepartmentIdByName(emp.department) ?? null,
      salary: emp.baseSalary,
      gender: emp.gender || '',
      nationality: emp.nationality || '',
      nationalId: emp.nationalId || '',
      email: emp.email || '',
      password: '',
      address: emp.address || '',
      phoneNumber: emp.phoneNumber || '',
      contractDate: this.formatDate(emp.contractDate),
      startTime: this.formatTime(emp.startTime),
      endTime: this.formatTime(emp.endTime),
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const payload: IUpdateEmployeeRequest = {
        id: this.employeeId.toString(),
        name: this.employeeForm.value.fullName,
        dateOfBirth: this.employeeForm.value.dateOfBirth,
        departmentId: +this.employeeForm.value.departmentId,
        // departmentId: this.employeeForm.value.departmentId,

        baseSalary: this.employeeForm.value.salary,
        gender: this.employeeForm.value.gender,
        nationality: this.employeeForm.value.nationality,
        nationalId: this.employeeForm.value.nationalId,
        email: this.employeeForm.value.email,
        address: this.employeeForm.value.address,
        phoneNumber: this.employeeForm.value.phoneNumber
          ? this.employeeForm.value.phoneNumber.replace(/\D/g, '')
          : '',
        contractDate: this.employeeForm.value.contractDate,
        startTime: this.convertTimeToDateTime(
          this.employeeForm.value.startTime,
          this.employeeForm.value.contractDate
        ),
        endTime: this.convertTimeToDateTime(
          this.employeeForm.value.endTime,
          this.employeeForm.value.contractDate
        ),
        ...(this.employeeForm.value.password
          ? { password: this.employeeForm.value.password }
          : {}),
      };

      console.log('Payload:', payload);

      this.empService.updateEmployee(this.employeeId, payload).subscribe({
        next: (res) => {
          this.toastr.success('Employee updated successfully!', 'Success');
          // this.router.navigate(['/dashboard/Employees']);
          // this.router.navigate([`/dashboard/view-employee/${id}`]);
          this.router.navigate(['/dashboard/Employees/view-employee', this.employeeId]);
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          console.error('Validation Errors:', err?.error?.errors);
          this.toastr.error(
            'Error updating employee. Check validation errors.',
            'Error'
          );
        },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
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

  goBack() {
    this.router.navigate(['/dashboard/Employees']);
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

  formatTime(value: string | null | undefined): string {
    if (!value || value === '0001-01-01T00:00:00') return '';
    return value.substring(11, 16);
  }

  formatDate(value: string | null | undefined): string | null {
    if (!value || value.startsWith('0001')) return null;
    return value.substring(0, 10);
  }

  getDepartmentIdByName(departmentName: string): number | null {
    const dept = this.departments.find((d) => d.name === departmentName);
    return dept ? dept.id : null;
  }

  convertTimeToDateTime(time: string, date: string): string {
    if (!time || !date) return '';
    return `${date}T${time}:00`;
  }
}
