import { SalaryEntity } from './salary.entity';
import { AllowanceSalaryEntity } from './allowance-salary.entity';
import { OvertimeSalaryEntity } from './overtime-salary.entity';
import { AbsentSalaryEntity } from './absent-salary.entity';
import { DeductionSalaryEntity } from './deduction-salary.entity';
import { HolidaySalaryEntity } from './holiday-salary.entity';
import { DayOffSalaryEntity } from './day-off-salary.entity';

export * from './absent-salary.entity';
export * from './allowance-salary.entity';
export * from './day-off-salary.entity';
export * from './deduction-salary.entity';
export * from './overtime-salary.entity';
export * from './permanent-salary.entity';
export * from './remote-salary.entity';
export * from './salary.entity';


export type UnionSalary =
  SalaryEntity
  | AllowanceSalaryEntity
  | OvertimeSalaryEntity
  | AbsentSalaryEntity
  | DeductionSalaryEntity
  | HolidaySalaryEntity
  | DayOffSalaryEntity
