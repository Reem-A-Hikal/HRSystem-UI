export interface IEmployee {
  id: string;
  name: string;
  department: string;
  departmentId: number;
  baseSalary: number;
  email: string;
  // password?: string;
  address: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  nationalId: string;
  birthDate: string;
  contractDate: string;
  startTime: string;
  endTime: string;
}
export interface ICreateEmployeeRequest {
  fullname: string;
  // department: string;
  departmentId?: number;
  salary: number;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  nationalId: string;
  dateOfBirth: string;
  contractDate: string;
  startTime: string;
  endTime: string;
}
export interface IUpdateEmployeeRequest {
  id: string;
  name: string;
  departmentId: number;
  baseSalary: number;
  email: string;
  password?: string;
  address: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  nationalId: string;
  dateOfBirth: string;
  contractDate: string;
  startTime: string;
  endTime: string;
}
