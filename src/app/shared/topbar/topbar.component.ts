import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  userName: string = '';

  ngOnInit() {
    const userData = localStorage.getItem('auth_user');

    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.fullName || '';
    }
  }
}
