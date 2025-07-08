import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ISetting } from '../../../models/ISetting';
import { IsettingService } from '../../../services/isetting.service';


@Component({
  selector: 'app-general-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.css',
})
export class GeneralSettingComponent implements OnInit {
  editMode = false;
  settingData!: ISetting;

  additional = '';
  deduction = '';
  paymentType = '';
  holiday1 = '';
  holiday2 = '';

  constructor(private settingService: IsettingService) {}

  ngOnInit(): void {
    this.settingService.getSettingById(1).subscribe({
      next: (res) => {
        this.settingData = res;
        this.additional = res.overTime.toString();
        this.deduction = res.deduction.toString();
        this.paymentType = res.type.toLowerCase();
        this.holiday1 = this.getDayName(res.firstHoliday);
        this.holiday2 = this.getDayName(res.secondHoliday);
      },
      error: (err: any) => {
        console.error('Failed to load settings', err);
      },
    });
  }

  saveSettings() {
    this.editMode = false;

    const payload: ISetting = {
      id: 1,
      type: this.paymentType.toLowerCase(),
      overTime: +this.additional,
      deduction: +this.deduction,
      firstHoliday: this.getDayIndex(this.holiday1),
      secondHoliday: this.getDayIndex(this.holiday2),
    };

    this.settingService.updateSetting(payload).subscribe({
      next: () => {
        console.log('Settings updated');
      },
      error: (err: any) => {
        console.error('Failed to update settings', err);
      },
    });
  }

  // Helpers to convert between day name and index
  getDayName(index: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[index] ?? '';
  }

  getDayIndex(name: string): number {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(name);
  }
}
