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

  constructor(private service: HolidayService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadHolidays();
  }

  loadHolidays() {
    this.service.getHolidays().subscribe((data) => (this.holidays = data));
  }

  createHoliday() {
    const newHoliday: IHoliday = {
      name: this.holidayName,
      date: this.holidayDate,
    };

    this.service.createHoliday(newHoliday).subscribe(() => {
      this.loadHolidays();
      this.toastr.success('Created successful', 'Success');
      // Reset the form fields
      this.holidayName = '';
      this.holidayDate = '';
    });
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

  deleteHoliday(id: number) {
    this.service.deleteHoliday(id).subscribe(
      (response) => {
        this.toastr.success('Deleted successful', 'Success');
        this.loadHolidays();
      },
      (error) => {
        this.toastr.error('Error', 'Error');
        console.log(error);
      }
    );
  }
}
