import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SidebarComponent, TopbarComponent, RouterModule]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}