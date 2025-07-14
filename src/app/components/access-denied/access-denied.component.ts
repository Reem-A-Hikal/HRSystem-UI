import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-access-denied',
  imports: [CommonModule, RouterModule],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent {
  constructor(private location: Location) {}
   goBack() {
    this.location.back(); 
  }

}
