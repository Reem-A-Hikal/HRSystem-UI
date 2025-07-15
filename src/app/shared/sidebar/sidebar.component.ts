import {
  Component,
  EventEmitter,
  HostListener,
  input,
  output,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { navbarData } from './navData';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/Auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = navbarData;

  constructor(public authService: AuthService) {}

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }
  hasPermission(permission: string): boolean {
  return this.authService.hasPermission(permission);
}


  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
  onLogout() {
    console.log('clicked');
    this.authService.logout();
  }
}
