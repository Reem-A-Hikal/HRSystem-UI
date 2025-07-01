export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  employeeName?: string;
  departmentName?: string;
}

export interface Employee {
  id: string;
  name: string;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
}