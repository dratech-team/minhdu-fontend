/**
 * Interface for the 'Auth' data
 */
export interface AuthEntity {
  id: string | number; // Primary ID
  name: string;
}
export  interface  AccountDTO {
  username: string;
  password: string ;
  appName: string;
  roleId: string;
  employeeId?: number,
  branchIds: number[]
}
