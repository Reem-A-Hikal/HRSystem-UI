import { Component, OnInit, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { BodyComponent } from '../body/body.component';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

interface SideNavToggle {
  screenWidth: number;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    SidebarComponent,
    RouterModule,
    CommonModule,
    BodyComponent,
    TopbarComponent,
    ChatbotComponent
  ],
})
export class DashboardComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  constructor() {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
