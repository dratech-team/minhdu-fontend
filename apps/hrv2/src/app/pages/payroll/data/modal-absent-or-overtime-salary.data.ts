import {PayrollEntity} from '../entities';
import {SalaryEntity} from '../../salary/entities';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {RequireOnlyOne} from '../../../../shared/types';

interface ModalAbsentOrOvertimeSalaryData {
  type: SalaryTypeEnum.ABSENT | SalaryTypeEnum.OVERTIME
  add: {
    payroll?: PayrollEntity,
    salary?: SalaryEntity
    multiple?: boolean
  }
  update: {
    salary: SalaryEntity
    multiple?: {
      salaries: SalaryEntity[]
    },
  }
}

export type ModalAddOrUpdateAbsentOrOvertime = RequireOnlyOne<ModalAbsentOrOvertimeSalaryData, 'add' | 'update'>
