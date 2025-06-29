export interface IUser {
  fullName: string;
  roles: string[];
  token?: string;
  expiresOn?: string;
}
