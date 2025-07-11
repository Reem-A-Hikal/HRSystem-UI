import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth.service';

@Component({
  selector: 'app-PrintReport',
  imports: [CommonModule],
  templateUrl: './PrintReport.component.html',
  styleUrls: ['./PrintReport.component.css'],
})
export class PrintReportComponent implements OnInit {
  infoSectionIcon = 'bi bi-info-circle';
  infoSectionTitle = 'Information Section';
  employeeName: string = '';
  infoCards = [
    { label: 'Card 1', value: 'Value 1', borderClass: 'border-primary' },
    { label: 'Card 2', value: 'Value 2', borderClass: 'border-success' },
    { label: 'Card 3', value: 'Value 3', borderClass: 'border-warning' },
    { label: 'Card 4', value: 'Value 4', borderClass: 'border-danger' },
  ];

  tableSection = {
    icon: 'bi bi-table',
    title: 'Table Section',
    headers: [
      { label: 'Header 1', class: 'text-primary' },
      { label: 'Header 2', class: 'text-success' },
    ],
    rows: [
      [
        { value: 'Row 1 Col 1', class: '' },
        { value: 'Row 1 Col 2', class: '' },
      ],
      [
        { value: 'Row 2 Col 1', class: '' },
        { value: 'Row 2 Col 2', class: '' },
      ],
    ],
  };

  highlightSection = {
    icon: 'bi bi-star-fill',
    title: 'Highlight Section',
    label: 'Highlighted Value',
    value: '12345',
  };

  actions = [
    {
      label: 'Print',
      class: 'btn btn-primary',
      title: 'Print Report',
      icon: 'bi bi-printer',
      onClick: () => {
        window.print();
      },
    },
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
