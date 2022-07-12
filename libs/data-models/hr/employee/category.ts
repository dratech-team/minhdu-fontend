import { App } from '../../../enums';
import { Branch } from '../orgChart/branch';
import { Employee } from './employee';

export interface Category {
  id: number;
  name: string;
  app?: App;
  branch?: Branch;
  BranchId?: number;
  EmployeeIds?: number[];
  employees: Employee[];
  note?: string;
}
