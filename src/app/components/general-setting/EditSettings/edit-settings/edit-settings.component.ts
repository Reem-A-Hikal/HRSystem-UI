import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISetting } from '../../../../models/ISetting';
import { IsettingService } from '../../../../services/isetting.service';

@Component({
  selector: 'app-edit-settings',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.css']
})
export class EditSettingsComponent implements OnInit {
  editMode = false;
  setting: ISetting | null = null;
  type: string = 'pound';
  firstHoliday: string = '';
  secondHoliday: string = '';
  overTime: string = '';
  deduction: string = '';

  daysOfWeek = [
    { name: 'Monday', value: 0 },
    { name: 'Tuesday', value: 1 },
    { name: 'Wednesday', value: 2 },
    { name: 'Thursday', value: 3 },
    { name: 'Friday', value: 4 },
    { name: 'Saturday', value: 5 },
    { name: 'Sunday', value: 6 }
  ];
  types = ['Hour', 'Pound'];

  constructor(
    private settingService: IsettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settingService.getSettingById().subscribe({
      next: (data: ISetting) => {
        this.setting = data;
        this.type = data.type.toLowerCase();
        this.firstHoliday = this.daysOfWeek.find(d => d.value === data.firstHoliday)?.name || '';
        this.secondHoliday = this.daysOfWeek.find(d => d.value === data.secondHoliday)?.name || '';
        this.overTime = data.overTime.toFixed(2);
        this.deduction = data.deduction.toFixed(2);
        this.toastr.success('Settings loaded successfully');
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.toastr.error(`Failed to load settings: ${err.message || err.error?.message || 'Unknown error'}`);
      }
    });
  }

  saveSettings(form: NgForm) {
    if (form.invalid) {
      this.toastr.error('Please fill all required fields correctly');
      return;
    }

    if (this.firstHoliday === this.secondHoliday && this.firstHoliday !== '') {
      this.toastr.error('First and second holidays must be different');
      return;
    }

    const setting: ISetting = {
      type: this.type,
      firstHoliday: this.daysOfWeek.find(d => d.name === this.firstHoliday)?.value ?? 4,
      secondHoliday: this.daysOfWeek.find(d => d.name === this.secondHoliday)?.value ?? 5,
      overTime: parseFloat(this.overTime),
      deduction: parseFloat(this.deduction)
    };

    console.log('Sending setting to API:', setting); // تسجيل البيانات المرسلة

    this.settingService.updateSetting(setting).subscribe({
      next: (response) => {
        console.log('Update response:', response); // تسجيل الاستجابة
        this.toastr.success('Settings updated successfully');
        this.editMode = false;
        this.loadSettings();
      },
      error: (err) => {
        console.error('Error updating settings:', err);
        this.toastr.error(`Failed to update settings: ${err.message || err.error?.message || 'Unknown error'}`);
      }
    });
  }

  getHolidayName(value: number): string {
    return this.daysOfWeek.find(d => d.value === value)?.name || 'Not specified';
  }
}
