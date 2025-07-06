import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AttendanceService,
} from '../../../services/Attendance.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Department, Employee } from '../../../models/IAttendance';

@Component({
  selector: 'app-manageAttendance',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './manageAttendance.component.html',
  styleUrls: ['./manageAttendance.component.css'],
})
export class ManageAttendanceComponent implements OnInit {
  attendanceForm!: FormGroup;
  isEditMode = false;
  recordId: string | null = null;
  errorMessage: string = '';

  employees: Employee[] = [];
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.fb.group({
      employeeId: ['', Validators.required],
      departmentId: ['', Validators.required],
      date: ['', Validators.required],
      checkInTime: ['', Validators.required],
      checkOutTime: [''],
    });
  }
  ngOnInit(): void {
    this.recordId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recordId;

    this.attendanceService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });

    this.attendanceService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
    if (this.isEditMode) {
      this.loadRecordForEditing();
    }
  }

  loadRecordForEditing() {
    console.log(this.recordId)
    this.attendanceService
      .getAttendanceRecord(this.recordId)
      .subscribe((record) => {
        this.attendanceForm.patchValue({
          employeeId: record.employeeId,
          date: record.date,
          checkInTime: record.checkInTime,
          checkOutTime: record.checkOutTime,
        });
      });
  }

  onSubmit() {
    if (this.attendanceForm.valid) {
      const formData = this.attendanceForm.value;

      if (this.isEditMode) {
        this.attendanceService
          .updateAttendance(this.recordId!, formData)
          .subscribe({
            next: () => this.router.navigate(['/dashboard/Attendance']),
            error: (err) => {
              console.error('Update failed:', err);
              this.errorMessage = 'Failed to update attendance record';
            },
          });
      } else {
        this.attendanceService.addAttendance(formData).subscribe({
          next: () => this.router.navigate(['/dashboard/Attendance']),
          error: (err) => console.error('Add failed:', err),
        });
      }
    }
  }
}
