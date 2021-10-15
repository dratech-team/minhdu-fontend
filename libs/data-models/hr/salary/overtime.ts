import { DatetimeUnitEnum, Gender, SalaryTypeEnum } from '../../../enums';
import { Salary } from './salary';
import { Position } from '../orgChart/position';
import { Branch } from '../orgChart/branch';

export interface Overtime {
  employees: employees[],
  total: {
    price: number,
    unit: DatetimeUnitEnum,
    times: number
  }
}

interface employees {
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
  salary?: { times: number, total: number, unit: DatetimeUnitEnum },
}
