export interface IUser {
  fullName: string;
  userId:string;
  roles: string[];
  token?: string;
  expiresOn?: string;
}
