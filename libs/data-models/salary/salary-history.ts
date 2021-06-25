import { Salary } from './salary';
import { Employee } from '../../../apps/hr/src/app/pages/employee/+state/employee.interface';

export interface SalaryHistory {
  id: number,
  salaries: Salary,
  employee: Employee,
  employeeId: number,
}
