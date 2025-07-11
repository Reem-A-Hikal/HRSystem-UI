import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HolidayService } from '../../services/holiday.service';
import { IHoliday, IHolidayResponse } from '../../models/IHoliday';
import { ToastrService } from 'ngx-toastr';
import { EditOfficialHolidayComponent } from '../edit-official-holiday/edit-official-holiday.component';

@Component({
  selector: 'app-official-holiday',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    EditOfficialHolidayComponent,
  ],
  templateUrl: './official-holiday.component.html',
  styleUrls: ['./official-holiday.component.css'],
})
export class OfficialHolidayComponent implements OnInit {
  holidays: IHolidayResponse[] = [];

  holidayName = '';
  holidayDate = '';
  showEditModal = false;
  selectedHoliday!: IHolidayResponse;
  screenWidth = window.innerWidth;
  isSidebarCollapsed = false;
  formSubmitted = false;

  constructor(private service: HolidayService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadHolidays();
  }
  get isEmpty(): boolean {
    return this.holidays.length === 0;
  }

  loadHolidays() {
    this.service.getHolidays().subscribe((data) => (this.holidays = data));
  }

  createHoliday() {
    this.formSubmitted = true;

    if (!this.holidayName || !this.holidayDate) return;

    if (this.isDateInPast(this.holidayDate)) {
      this.toastr.error('Holiday date must be today or in the future');
      return;
    }

    if (this.isDuplicateHoliday(this.holidayName, this.holidayDate)) {
      this.toastr.error('A holiday with the same name and date already exists');
      return;
    }

    const newHoliday: IHoliday = {
      name: this.holidayName.trim(),
      date: this.holidayDate,
    };

    this.service.createHoliday(newHoliday).subscribe(
      () => {
        this.loadHolidays();
        this.toastr.success('Created successful', 'Success');
        // Reset the form fields
        this.holidayName = '';
        this.holidayDate = '';
        this.formSubmitted = false;
      },
      (error) => {
        this.toastr.error('Error creating holiday', 'Error');
        console.error('Error creating holiday:', error);
      }
    );
  }

  private isDateInPast(date: string): boolean {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }

  private isDuplicateHoliday(name: string, date: string): boolean {
    return this.holidays.some(
      (holiday) =>
        holiday.name.toLowerCase() === name.toLowerCase() &&
        new Date(holiday.date).toDateString() === new Date(date).toDateString()
    );
  }

  openEditModal(holiday: IHolidayResponse) {
    this.selectedHoliday = holiday;
    this.showEditModal = true;
  }

  editHoliday(id: number) {
    this.service.getHolidayById(id).subscribe(
      (holiday) => {
        this.selectedHoliday = { ...holiday };
        this.showEditModal = true;
      },
      (error) => {
        this.toastr.error('Error fetching holiday', 'Error');
        console.log(error);
      }
    );
  }

  handleSave(updatedHoliday: IHolidayResponse) {
    this.service.updateHoliday(updatedHoliday).subscribe(
      () => {
        const index = this.holidays.findIndex(
          (h) => h.id === updatedHoliday.id
        );
        if (index !== -1) {
          this.holidays[index] = updatedHoliday;
        }
        this.toastr.success('Updated successful', 'Success');
        this.showEditModal = false;
      },
      (error) => {
        this.toastr.error('Error updating holiday', 'Error');
        console.log(error);
      }
    );
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  async deleteHoliday(id: number) {
    const Swal = await import('sweetalert2');

    const result = await Swal.default.fire({
      title: `Are you sure?`,
      text: `You are about to delete this holiday.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      this.service.deleteHoliday(id).subscribe({
        next: () => {
          Swal.default.fire({
            title: 'Deleted!',
            text: 'The holiday has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          this.loadHolidays();
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.default.fire({
            title: 'Error!',
            text: 'Failed to delete holiday.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }
}
