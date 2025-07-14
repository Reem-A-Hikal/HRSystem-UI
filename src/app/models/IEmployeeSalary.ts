import { Pagination } from "./Pagination";

export interface IEmployeeSalary
{
  employeeName: string;
  departmentName: string | null;
  basicSalary: number;
  presentDays: number;
  absentDays: number;
  extraHours: number;
  deductionInHours: number;
  totalAddition: number;
  totalDeduction: number;
  netSalary: number;
}

export interface SalaryApiResponse extends Pagination {
  items: IEmployeeSalary[];
}