import { RouterLink } from '@angular/router';

export const navbarData = [
  // {
  //   RouterLink: '/dashboard/dashboard-view',
  //   icon: 'bi bi-house',
  //   label: 'Dashboard',
  // },

  {
    routeLink: '/dashboard/Roles',
    icon: 'bi bi-shield',
    label: 'Roles',
  },
  {
    routeLink: '/dashboard/Users',
    icon: 'bi bi-person-badge',
    label: 'Users',
  },
  {
    routeLink: '/dashboard/Employees',
    icon: 'bi bi-people',
    label: 'Employees',
  },
  {
    routeLink: '/dashboard/Attendance',
    icon: 'bi bi-calendar',
    label: 'Attendance',
  },
  {
    routeLink: '/dashboard/SalaryReport',
    icon: 'bi bi-receipt',
    label: 'Report',
  },
  {
    routeLink: '/dashboard/official-holiday',
    icon: 'bi bi-calendar2-day',
    label: 'Holidays',
  },
  {
    routeLink: '/dashboard/general-setting',
    icon: 'bi bi-gear',
    label: 'Settings',
  },
];
