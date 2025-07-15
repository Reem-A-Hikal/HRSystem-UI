import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/Auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '../../services/Toastr.service';
import { EditSettingDto, SettingService } from '../../services/Setting.service';

// enum SettingType {
//   Hour = 1,
//   Pound = 2,
// }
@Component({
  selector: 'app-general-setting',
  imports: [FormsModule, CommonModule],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.css',
})
export class GeneralSettingComponent implements OnInit {
  editMode = false;

  additional!: number;
  deduction!: number;
  paymentType!: string;
  holiday1!: string;
  holiday2!: string;

  // SettingType = ;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService,
    private settingsService: SettingService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.additional = data.overTime;
        this.deduction = data.deduction;
        this.paymentType = data.type;
        this.holiday1 = data.firstHoliday;
        this.holiday2 = data.secondHoliday;
        console.log('Settings loaded:', data);
      },
      error: () => {
        this.toastr.onError('Failed to load settings.');
      },
    });
  }
  cancelEdit(): void {
    this.editMode = false;
    this.loadSettings();
  }

  saveSettings(): void {
    const dto: EditSettingDto = {
      type: this.paymentType,
      overTime: this.additional,
      deduction: this.deduction,
      firstHoliday: this.holiday1,
      secondHoliday: this.holiday2,
    };

    this.settingsService.updateSettings(dto).subscribe({
      next: () => {
        this.toastr.onSuccess('Settings updated successfully!');
        this.editMode = false;
      },
      error: () => {
        this.toastr.onError('Failed to update settings.');
      },
    });
  }

  isHolidayConflict(): boolean {
    return this.holiday1 === this.holiday2;
  }

  get additionalInvalid(): boolean {
    if (this.paymentType === "Hour") {
      const val = Number(this.additional);
      return (
        isNaN(val) || val < 1 || val > 10 || val * 2 !== Math.floor(val * 2)
      ); // allow .5 steps
    } else {
      const val = Number(this.additional);
      return isNaN(val) || val < 50 || val > 20000;
    }
  }

  get deductionInvalid(): boolean {
    if (this.paymentType === "Hour") {
      const val = Number(this.deduction);
      return (
        isNaN(val) || val < 1 || val > 10 || val * 2 !== Math.floor(val * 2)
      ); // allow .5 steps
    } else {
      const val = Number(this.deduction);
      return isNaN(val) || val < 50 || val > 20000;
    }
  }
}
