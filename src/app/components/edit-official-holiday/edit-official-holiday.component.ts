import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth.service';


@Component({
  selector: 'app-edit-official-holiday',
  imports: [FormsModule, CommonModule],

  templateUrl: './edit-official-holiday.component.html',
  styleUrl: './edit-official-holiday.component.css'
})
export class EditOfficialHolidayComponent {
   constructor(public authService: AuthService) {} 
holiday = { id:1 , name: 'Eiad Adha', date: '2025-10-04' };

  // constructor(
  //   private route: ActivatedRoute,
  //   private http: HttpClient,
  //   private router: Router
  // ) {}

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // this.http.get<any>(`/api/holidays/${id}`).subscribe(data => this.holiday = data);
  }

  saveChanges() {
    // this.http.put(`/api/holidays/${this.holiday.id}`, this.holiday).subscribe(() => {
    //   this.router.navigate(['/holidays']);
    }
}
