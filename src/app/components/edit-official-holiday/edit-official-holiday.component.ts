import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HolidayService } from '../../services/holiday.service';
import { IHolidayResponse } from '../../models/IHoliday';

@Component({
  selector: 'app-edit-official-holiday',
  imports: [FormsModule],
  templateUrl: './edit-official-holiday.component.html',
  styleUrl: './edit-official-holiday.component.css'
})
export class EditOfficialHolidayComponent {
holiday!:IHolidayResponse ;
// test!:Date ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service:HolidayService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getHolidayById(+id!).subscribe(data => {
      this.holiday = data;
    });
    // this.test= new Date(this.holiday.date);
  }

  saveChanges() {
    // this.http.put(`/api/holidays/${this.holiday.id}`, this.holiday).subscribe(() => {
    //   this.router.navigate(['/holidays']);
    }
}
