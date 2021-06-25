import { Employee } from '../../../apps/hr/src/app/pages/employee/+state/employee.interface';
import { Payroll } from '../../../apps/hr/src/app/pages/payroll/+state/payroll.interface';
import { DatetimeUnitEnum, SalaryTypeEnum } from '../../enums';
import { SalaryHistory } from './salary-history';


export interface Salary {
  overtime: number,
  stay:number,
  basic: number,
  actualDay: number,
  allowance: number,
  deduction:number,
  daySalary: number,
  salaryActual: number,
  tax: number,
  total: number,
  id: number,
  title: string,
  type: SalaryTypeEnum,
  times: number,
  price: number,
  unit: DatetimeUnitEnum,
  rate: number,
  datetime: Date,
  forgot: boolean,
  note: string,
  employee: Employee,
  employeeId: number,
  Payroll: Payroll,
  PayrollId: number,
  salaryHistory: SalaryHistory,
  salaryHistoryId: number,
}
