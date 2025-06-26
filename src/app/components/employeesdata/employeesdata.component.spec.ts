import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesdataComponent } from './employeesdata.component';

describe('EmployeesdataComponent', () => {
  let component: EmployeesdataComponent;
  let fixture: ComponentFixture<EmployeesdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
