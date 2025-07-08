import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IsettingService } from '../../../services/isetting.service';
import { ISetting } from '../../../models/ISetting';

@Component({
  selector: 'app-EditSettings',
  imports: [ReactiveFormsModule],
   templateUrl: './EditSetttings.component.html',
  styleUrls: ['./EditSetttings.component.css']
})
export class EditSettingsComponent implements OnInit {

  settingForm!: FormGroup;
  settingId = 1;

  constructor(
    private fb: FormBuilder,
    private settingService: IsettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.settingForm = this.fb.group({
      id: [this.settingId],
      type: ['', Validators.required],
      firstHoliday: [0, Validators.required],
      secondHoliday: [0, Validators.required],
      overTime: [0, Validators.required],
      deduction: [0, Validators.required],
    });

    this.settingService.getSettingById(this.settingId).subscribe({
      next: (data) => {
        this.settingForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.toastr.error('Failed to load settings');
      }
    });
  }

  onSubmit() {
    if (this.settingForm.valid) {
      const updatedSetting: ISetting = this.settingForm.value;
      this.settingService.updateSetting(updatedSetting).subscribe({
        next: () => {
          this.toastr.success('Settings updated successfully');
        },
        error: (err) => {
          console.error('Error updating settings:', err);
          this.toastr.error('Error updating settings');
        }
      });
    } else {
      this.settingForm.markAllAsTouched();
    }
  }
}
