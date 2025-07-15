export interface ITotalEmployees {
  totalEmployees: number;
}

export interface IEmployeesByDepartment {
  departmentName: string;
  employeeCount: number;
}

export interface IGenderDistribution {
  gender: string;
  count: number;
}

export interface IAgeGroup {
  ageGroup: string;
  count: number;
}

export interface INationalityDistribution {
  nationality: string;
  count: number;
}

export interface IAverageDailyAttendance {
  dailyAttendance: number;
}

export interface IAverageSalary {
  averageSalary: number;
}
