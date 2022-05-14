import {PayrollEntity} from '../entities';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {RequireOnlyOne} from '../../../../shared/types';
import {DayOffSalaryEntity} from "../../salary/entities/day-off-salary.entity";

interface ModalDayOffSalaryData {
  add: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update: {
    salary: DayOffSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}

export type ModalAddOrUpdateDayOff = RequireOnlyOne<ModalDayOffSalaryData, 'add' | 'update'>
