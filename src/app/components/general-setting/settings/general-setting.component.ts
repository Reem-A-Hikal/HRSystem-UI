import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ISetting } from '../../../models/ISetting';
import { IsettingService } from '../../../services/isetting.service';


@Component({
  selector: 'app-settings-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.css',
})
export class SettingsDisplayComponent implements OnInit {
  setting: ISetting | null = null;
  daysOfWeek = [
      { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 },
  ];

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
          this.toastr.success('Settings loaded successfully');
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.toastr.error('Failed to load settings');
      },
    });
  }

  getHolidayName(value: number): string {
    return this.daysOfWeek.find(d => d.value === value)?.name || 'Not specified';
  }
}
