import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth.service';
import { Router } from '@angular/router';
import { ToastrService } from '../../../services/Toastr.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

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

  employee: any;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private router: Router,
    public authService:AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.employee = nav?.extras?.state?.['employee'] || history.state['employee'];

    console.log('Employee data:', this.employee);
    if (!this.employee) {
      console.warn('No employee data found. Redirecting...');
    }
  }

  // exportAsPDF() {
  //   // Implement PDF export logic here
  //   console.log('Exporting as PDF...');
  //   this.toastr.onSuccess('Exported to PDF successfully');
  // }
  exportAsPDF() {
  const DATA = this.pdfContent.nativeElement;

  html2canvas(DATA).then(canvas => {
    const imgWidth = 208;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const position = 10;

    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save(`${this.employeeName}_Payslip.pdf`);

    this.toastr.onSuccess('Exported to PDF successfully!');
  });
}

  Print(): void {
  const printContents = this.pdfContent.nativeElement.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // Reload to restore event bindings and state
}
  
  // Print() {
  //   const DATA = this.pdfContent.nativeElement;

  //   html2canvas(DATA).then(canvas => {
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const position = 10;

  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.autoPrint();
  //     window.open(pdf.output('bloburl'), '_blank');
  //   });
  // }
  

}

