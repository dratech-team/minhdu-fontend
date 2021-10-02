import { Employee, Salary,  } from '@minhdu-fontend/data-models';
import { PayslipCT1, PayslipCT2 } from '../payslip/payslip.interface';

export interface Payroll {
  id: number
  employee: Employee,
  createdAt: Date,
  salaries: Salary[],
  manConfirmedAt: Date,
  paidAt: Date,
  accConfirmedAt: Date,
  actualDay: number,
  payrollIds: number[]
  payslip:  PayslipCT2 & PayslipCT1
}
