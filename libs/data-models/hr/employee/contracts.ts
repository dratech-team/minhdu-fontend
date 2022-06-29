import { Employee } from './employee';

export interface Contracts {
  id: number;
  contractId: number;
  type: any;
  name: string;
  position: string;
  createdAt: Date;
  expiredAt: Date;
  employee: Employee;
  employeeId: number;
}
