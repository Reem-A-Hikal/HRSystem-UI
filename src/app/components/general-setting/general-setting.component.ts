import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/Auth.service';


@Component({
  selector: 'app-general-setting',
  imports: [FormsModule, CommonModule],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.css',
})
export class GeneralSettingComponent {
  editMode = false;
  additional = '';
  deduction = '';
  paymentType = 'hour';
  holiday1 = 'Friday';
  holiday2 = 'Saturday';
  constructor(public authService: AuthService) {}

  saveSettings() {
    this.editMode = false;
    // Save logic (API call)
  }
}
