import { DatetimeUnitEnum, SalaryTypeEnum } from '../../../enums';
import { SalaryHistory } from './salary-history';
import { Employee } from '../employee/employee';

export interface Overtime {
  id: number,
  title: string,
  type: SalaryTypeEnum,
  times: number,
  price: number,
  unit: DatetimeUnitEnum,
  rate: number,
  datetime: Date,
  note: string,
  employeeId: number,
  PayrollId: number,
  salaryHistory: SalaryHistory,
  salaryHistoryId: number,
  allowance?: any,
  employee?: Employee
}
