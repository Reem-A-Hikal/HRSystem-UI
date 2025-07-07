export interface AttendanceDto {
  date: string;
  arrivalTime: string;
  departureTime: string;
  employeeId: string;
}

export interface AttendanceUpdateDto extends AttendanceDto {
  id: number | null;
}

export interface AttendanceRecord extends AttendanceUpdateDto {
  departmentId: number;
  employeeName?: string;
  departmentName?: string;
}

export interface PaginatedList<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DeleteResponse {
  message: string;
}
