import { Employee } from '../../employee/+state/employee.interface';
import { Position, Salary } from '@minhdu-fontend/data-models';

export interface Payroll {
  id:number
  employee: Employee,
  createAt: Date,
  salary: Salary,
  salaries: Salary[],
  manConfirmedAt: Date,
  paidAt: Date,
  accConfirmAt: Date,
  basic: number,
  allowance: number,
  absent: number,
  overtime: number,
  stay: number,
  total: number,
  note: string,
  actuallyDay: number,
}

