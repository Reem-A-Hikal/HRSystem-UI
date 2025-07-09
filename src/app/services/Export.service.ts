import { Injectable } from '@angular/core';
import { AttendanceRecord } from '../models/IAttendance';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  async exportToExcel(
    records: AttendanceRecord[],
    title?: string
  ): Promise<void> {
    if (!Array.isArray(records) || records.length === 0) return;

    const [{ utils, write }] = await Promise.all([import('xlsx')]);
    const { saveAs } = await import('file-saver');

    const headers = [
      'Employee Name',
      'Department',
      'Date',
      'Check-in Time',
      'Check-out Time',
    ];

    const data = records.map(
      ({ employeeName, departmentName, date, arrivalTime, departureTime }) => {
        const formatDate = (d?: string) =>
          d ? new Date(d).toLocaleDateString('en-US') : '';
        const formatTime = (t?: string) =>
          t
            ? new Date(t).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

        return [
          employeeName ?? '',
          departmentName ?? '',
          formatDate(date),
          formatTime(arrivalTime),
          formatTime(departureTime),
        ];
      }
    );

    // Create a new worksheet and add the title and headers
    const worksheet = utils.aoa_to_sheet([]);
    // Add title to the first row and merge cells
    utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
    // Merge the first row cells for the title
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // Add headers to the second row
    utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

    // Add data starting from the third row
    utils.sheet_add_aoa(worksheet, data, { origin: 'A3' });

    // Set column widths based on the maximum length of the data in each column
    worksheet['!cols'] = headers.map((header, i) => ({
      wch:
        Math.max(
          header.length,
          ...data.map((row) => row[i]?.toString().length ?? 0)
        ) + 2,
    }));

    // Set styles for the title and headers
    worksheet['A1'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    };

    // Set styles for the header row
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      fill: { fgColor: { rgb: 'DCE6F1' } },
    };

    // Apply header style to each header cell
    ['A2', 'B2', 'C2', 'D2', 'E2'].forEach((cell) => {
      if (worksheet[cell]) worksheet[cell].s = headerStyle;
    });

    // Set autofilter for the data range
    worksheet['!autofilter'] = { ref: `A2:E${records.length + 2}` };

    // Create a workbook and add the worksheet
    const workbook = {
      Sheets: { 'Attendance Records': worksheet },
      SheetNames: ['Attendance Records'],
    };

    // Write the workbook to a binary string and create a Blob
    const excelBuffer: any = write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Create a Blob from the binary string
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Save the Blob as an Excel file
    saveAs(blob, `Attendance_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  async exportToPDF(
    records: AttendanceRecord[]
  ): Promise<void> {

    const logoBase64 = await this.loadLogo('/logo.jpg');

    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A4',
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    const headers = [
      'Employee Name',
      'Department Name',
      'Date',
      'Check-in Time',
      'Check-out Time',
    ];

    const rows = records.map((item) => {
      const date = new Date(item.date);
      const checkIn = new Date(item.arrivalTime);
      const checkOut = new Date(item.departureTime);

      return [
        item.employeeName || '',
        item.departmentName || '',
        date.toLocaleDateString('en-US'),
        checkIn.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        checkOut.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      ];
    });
    // Add a header section with a colored rectangle and logo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFillColor(36, 87, 166);
    doc.rect(0, 0, pageWidth, 60, 'F');

    if (logoBase64) {
      doc.addImage(logoBase64, 'JPG', margin, 10, 40, 40); // (x, y, width, height)
    }

    // Add title and subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255);
    doc.text('Pioneers Solutions', pageWidth / 2, 32, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(36, 87, 166);
    doc.text('Attendance & Departures Report', pageWidth / 2, 80, {
      align: 'center',
    });

    // Add date of generation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      100,
      {
        align: 'right',
      }
    );

    // Add table with attendance records
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 115,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: { fillColor: [36, 87, 166], textColor: 255 },
      didDrawPage: (data) => {
        const pageNumber = doc.getCurrentPageInfo().pageNumber;
        const totalPages = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - margin,
          doc.internal.pageSize.getHeight() - 15,
          { align: 'right' }
        );
      },
      margin: { left: margin, right: margin },
    });

    // Save the PDF document
    doc.save(`Attendance_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  private async loadLogo(logoUrl: string): Promise<string> {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error('Failed to load logo');
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
