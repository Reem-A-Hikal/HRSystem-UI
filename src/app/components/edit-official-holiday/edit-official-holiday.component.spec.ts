import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfficialHolidayComponent } from './edit-official-holiday.component';

describe('EditOfficialHolidayComponent', () => {
  let component: EditOfficialHolidayComponent;
  let fixture: ComponentFixture<EditOfficialHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOfficialHolidayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOfficialHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
