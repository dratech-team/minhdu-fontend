import {PayrollEntity} from '../entities';
import {RequireOnlyOne} from '../../../../shared/types';
import {DeductionSalaryEntity, SalaryEntity} from "../../salary/entities";

interface ModalDeductionSalaryData {
  add: {
    payroll: PayrollEntity,
    salary: SalaryEntity
    multiple?: boolean
  }
  update: {
    salary: DeductionSalaryEntity
    multiple?: {
      salaries: SalaryEntity[]
    },
  }
}

export type ModalAddOrUpdateDeduction = RequireOnlyOne<ModalDeductionSalaryData, 'add' | 'update'>
