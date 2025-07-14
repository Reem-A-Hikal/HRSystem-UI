export interface IAuthResponse {
  message: string;
  isAuthenticated: boolean;
  roles: string[];
  permissions: string[]; 
  token: string;
  expiresOn: string;
  fullName: string;
  userId:string;
}


export interface ICreateEmployeeResponse {
  message: string;
  employeeId: string;
}
