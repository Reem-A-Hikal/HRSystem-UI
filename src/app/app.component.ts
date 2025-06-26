import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesdataComponent } from './components/employeesdata/employeesdata.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeesdataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'HRSystem-UI';
}
