import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HolidayService } from '../../services/holiday.service';
import { IHoliday, IHolidayResponse } from '../../models/IHoliday';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-official-holiday',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDatepickerModule],
  templateUrl: './official-holiday.component.html',
  styleUrls: ['./official-holiday.component.css']
})
export class OfficialHolidayComponent implements OnInit {
// holidays = [
//   {id:1,name: 'Dependence day', date: '2025-10-04'}, 
//   {id:2,name: 'Eid Al-Adha', date: '2025-6-1'}
// ];
holidays: IHolidayResponse[] = [];

  holidayName = '';
  holidayDate = '';

 constructor(private service:HolidayService, private router:Router,private toastr:ToastrService) {}

  ngOnInit() {
    this.loadHolidays();
  }

  loadHolidays() {
    this.service.getHolidays().subscribe(data => this.holidays = data);
  }

  createHoliday() {
    const newHoliday: IHoliday = {
      name: this.holidayName,
      date: this.holidayDate
    };

    this.service.createHoliday(newHoliday).subscribe(() => {
      this.loadHolidays();
      this.holidayName = '';
      this.holidayDate = '';
    });
  }

  editHoliday(id: number) {
    this.router.navigate([`/dashboard/edit-official-holiday/${id}`]);
  }

  deleteHoliday(id: number) {
    this.service.deleteHoliday(id).subscribe(
      (response) => {
        this.toastr.success('Deleted successful', 'Success')
        this.loadHolidays();
      },
      (error) => {
        this.toastr.error('Error', 'Error');
        console.log(error);
      }
    );
  }
}
