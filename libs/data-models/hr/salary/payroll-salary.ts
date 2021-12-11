import { DatetimeUnitEnum, Gender, SalaryTypeEnum } from '../../../enums';
import { Salary } from './salary';
import { Position } from '../orgChart/position';
import { Branch } from '../orgChart/branch';

export interface PayrollSalary {
  employees: employee[],
  total: {
    price: number,
    unit: string,
    times: number
  }
}

export interface employee {
  id: number,
  firstName: string,
  lastName: string,
  title: string,
  type: SalaryTypeEnum,
  gender: Gender
  payrollId: number,
  salaries: Salary[],
  position: Position,
  branch: Branch,
  salary?: { times: number, total: number, unit: string },
}
