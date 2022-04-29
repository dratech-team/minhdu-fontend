import {PayrollEntity} from '../entities';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {RequireOnlyOne} from '../../../../shared/types';
import {DeductionSalaryEntity} from "../../salary/entities/deduction-salary.entity";

interface ModalDeductionSalaryData {
  add: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update: {
    salary: DeductionSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}

export type ModalAddOrUpdateDeduction = RequireOnlyOne<ModalDeductionSalaryData, 'add' | 'update'>
