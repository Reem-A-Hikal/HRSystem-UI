import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AttendanceService } from '../../../services/Attendance.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { EmployeeService } from '../../../services/Employee.service';
import { IEmployee } from '../../../models/IEmployee';
import { ToastrService } from '../../../services/Toastr.service';
import {
  AttendanceDto,
  AttendanceUpdateDto,
} from '../../../models/IAttendance';

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

@Component({
  selector: 'app-manageAttendance',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    TimepickerModule,
  ],
  templateUrl: './manageAttendance.component.html',
  styleUrls: ['./manageAttendance.component.css'],
})
export class ManageAttendanceComponent implements OnInit {
  attendanceForm!: FormGroup;
  isEditMode = false;
  recordId: number | null = null;
  errorMessage: string = '';
  maxDate = new Date();
  formSubmitted = false;

  employees: IEmployee[] = [];
  departments: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService,
    private empService: EmployeeService,
    private toastr: ToastrService
  ) {
    this.attendanceForm = this.fb.group(
      {
        employeeId: ['', Validators.required],
        departmentId: ['', Validators.required],
        date: ['', [Validators.required, this.dateValidator]],
        checkInTime: ['', Validators.required],
        checkOutTime: ['', Validators.required],
      },
      { validators: [this.timeValidator, this.workingHoursValidator] }
    );
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const selectDate = control.value;
    if (!selectDate) return null;

    const today = new Date();
    const selected = new Date(selectDate);

    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    // Check if date is in the future
    if (selected > today) {
      return { futureDate: true };
    }

    // Check if date is more than 30 days old
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    if (selected < thirtyDaysAgo) {
      return { tooOld: true };
    }

    return null;
  }

  timeValidator(control: AbstractControl): ValidationErrors | null {
    const checkInTime = control.get('checkInTime')?.value;
    const checkOutTime = control.get('checkOutTime')?.value;

    if (!checkInTime || !checkOutTime) return null;

    // Convert time strings to minutes for comparison
    const checkInMinutes = timeToMinutes(checkInTime);
    const checkOutMinutes = timeToMinutes(checkOutTime);

    if (checkOutMinutes <= checkInMinutes) {
      return { invalidTimeRange: true };
    }

    return null;
  }

  workingHoursValidator(control: AbstractControl): ValidationErrors | null {
    const checkInTime = control.get('checkInTime')?.value;
    const checkOutTime = control.get('checkOutTime')?.value;

    if (!checkInTime || !checkOutTime) return null;

    const checkInMinutes = timeToMinutes(checkInTime);
    const checkOutMinutes = timeToMinutes(checkOutTime);

    // Check for minimum working hours (4 hours = 240 minutes)
    const workingMinutes = checkOutMinutes - checkInMinutes;
    if (workingMinutes < 240) {
      return { minimumWorkingHours: true };
    }

    // Check for maximum working hours (16 hours = 960 minutes)
    if (workingMinutes > 960) {
      return { maximumWorkingHours: true };
    }

    // Check for reasonable working hours (6 AM to 11 PM)
    const earliestStart = 6 * 60; // 6:00 AM
    const latestEnd = 23 * 60; // 11:00 PM

    if (checkInMinutes < earliestStart) {
      return { tooEarly: true };
    }

    if (checkOutMinutes > latestEnd) {
      return { tooLate: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.recordId;

    this.empService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
      console.log('Employees:', this.employees);
      
      if (this.isEditMode) {
        this.loadRecordForEditing();
        // console.log('Employees:', this.employees);
      }
    });

    this.empService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });

    this.attendanceForm.statusChanges.subscribe(() => {
      if (this.formSubmitted) {
        this.attendanceForm.updateValueAndValidity({ onlySelf: false });
      }
    });
  }

  loadRecordForEditing() {
    this.attendanceService.getById(this.recordId).subscribe({
      next: (record) => {
        this.attendanceForm.patchValue({
          employeeId: record.employeeId,
          departmentId: record.departmentId,
          date: new Date(record.date),
          checkInTime: this.extractTime(record.arrivalTime),
          checkOutTime: this.extractTime(record.departureTime),
        });
        if (this.isEditMode) {
          this.attendanceForm.get('employeeId')?.disable();
          this.attendanceForm.get('departmentId')?.disable();
        }
      },
      error: (err) => {
        console.error('Failed to load record', err);
        this.errorMessage = 'Failed to load attendance record';
        this.toastr.onError(this.errorMessage, 'Error');
      },
    });
  }

  extractTime(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // أو `${hours}:${minutes}:00` لو بتستخدمي صيغة seconds كمان
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.attendanceForm.valid && !this.attendanceForm.errors) {
      const formData = this.attendanceForm.getRawValue();

      const newAtt: AttendanceDto = {
        date: this.formatDateToISO(formData.date),
        arrivalTime: this.formatTimeToISO(formData.date, formData.checkInTime),
        departureTime: this.formatTimeToISO(
          formData.date,
          formData.checkOutTime
        ),
        employeeId: formData.employeeId,
      };

      const updatedAtt: AttendanceUpdateDto = {
        id: this.recordId,
        date: this.formatDateToISO(formData.date),
        arrivalTime: this.formatTimeToISO(formData.date, formData.checkInTime),
        departureTime: this.formatTimeToISO(
          formData.date,
          formData.checkOutTime
        ),
        employeeId: formData.employeeId,
      };
      // console.log('Form Data', formData);
      // console.log('Update Payload', updatedAtt);
      // console.log('recordId', this.recordId);
      // console.log('formData.employeeId', formData.employeeId);
      const operation = this.isEditMode
        ? this.attendanceService.updateAttendance(updatedAtt)
        : this.attendanceService.add(newAtt);

      operation.subscribe({
        next: (Response) => {
          // console.log('Attendance added successfully', Response);
          const message = this.isEditMode
            ? 'Attendance updated successfully'
            : 'Attendance added successfully';

          this.toastr.onSuccess(message, 'Success');
          this.router.navigate(['/dashboard/Attendance']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.onError(err.error.message, 'Error');
            return;
          }
          this.toastr.onError('Error adding attendance', 'Error');
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.attendanceForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }

  private formatTimeToISO(date: Date, time: string): string {
    const [hours, minutes] = time.split(':');
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  // Getter methods for easy access in template
  get employeeId() {
    return this.attendanceForm.get('employeeId');
  }
  get departmentId() {
    return this.attendanceForm.get('departmentId');
  }
  get date() {
    return this.attendanceForm.get('date');
  }
  get checkInTime() {
    return this.attendanceForm.get('checkInTime');
  }
  get checkOutTime() {
    return this.attendanceForm.get('checkOutTime');
  }
}
