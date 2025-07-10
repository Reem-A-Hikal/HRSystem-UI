import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IHolidayResponse } from '../../models/IHoliday';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-official-holiday',
  imports: [FormsModule, BsDatepickerModule, CommonModule],
  templateUrl: './edit-official-holiday.component.html',
  styleUrl: './edit-official-holiday.component.css',
})
export class EditOfficialHolidayComponent {
  @Input() holiday!: IHolidayResponse;
  @Input() isSidebarCollapsed = false;
  @Input() screenWidth = 0;
  @Output() save = new EventEmitter<IHolidayResponse>();
  @Output() closeModal = new EventEmitter<void>();

  onSubmit() {
    if (this.holiday.date instanceof Date) {
      const dateObj = this.holiday.date;
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      this.holiday.date = `${year}-${month}-${day}`;
    }
    this.save.emit(this.holiday);
  }

  close() {
    this.closeModal.emit();
  }
}
