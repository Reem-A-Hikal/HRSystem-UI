import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-official-holiday',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDatepickerModule],
  templateUrl: './official-holiday.component.html',
  styleUrls: ['./official-holiday.component.css']
})
export class OfficialHolidayComponent implements OnInit {

holidays = [
  {id:1,name: 'Dependence day', date: '2025-10-04'}, 
  {id:2,name: 'Eid Al-Adha', date: '2025-6-1'}
];

  holidayName = '';
  holidayDate = '';

  constructor( public authService: AuthService) {}

  ngOnInit() {
    this.loadHolidays();
  }

  loadHolidays() {
    // this.http.get<any[]>('/api/holidays').subscribe(data => this.holidays = data);
  }

  createHoliday() {
    // const newHoliday = { name: this.holidayName, date: this.holidayDate };
    // this.http.post('/api/holidays', newHoliday).subscribe(() => {
    //   this.loadHolidays();
    //   this.holidayName = '';
    //   this.holidayDate = '';
    // });
  }

  editHoliday(holiday: any) {
    //logic
  }

  deleteHoliday(id: number) {
    // this.http.delete(`/api/holidays/${id}`).subscribe(() => this.loadHolidays());
  }
}
