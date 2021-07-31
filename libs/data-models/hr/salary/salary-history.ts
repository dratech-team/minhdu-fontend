import { Employee } from '../../index';
import { Salary } from './salary';


export interface SalaryHistory {
  id: number,
  salaries: Salary,
  employee: Employee,
  employeeId: number,
}
