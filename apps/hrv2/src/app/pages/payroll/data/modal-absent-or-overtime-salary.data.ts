import { PayrollEntity } from '../entities';
import { DeductionSalaryEntity, OvertimeSalaryEntity } from '../../salary/entities';
import { SalaryPayroll } from '@minhdu-fontend/data-models';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { RequireOnlyOne } from '../../../../shared/types';

interface ModalAbsentOrOvertimeSalaryData {
  type: SalaryTypeEnum.ABSENT | SalaryTypeEnum.OVERTIME
  add: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update: {
    salary: OvertimeSalaryEntity & DeductionSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}

export type ModalAddOrUpdateAbsentOrOvertime = RequireOnlyOne<ModalAbsentOrOvertimeSalaryData, 'add' | 'update'>
