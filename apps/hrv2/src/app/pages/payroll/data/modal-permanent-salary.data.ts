import { PayrollEntity } from '../entities';
import { PermanentSalaryEntity } from '../../salary/entities';
import { SalaryPayroll } from '@minhdu-fontend/data-models';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {RequireOnlyOne} from "../../../../shared/types";

export interface ModalPermanentSalaryData {
  type: SalaryTypeEnum
  add?: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update?: {
    salary: PermanentSalaryEntity
    history?: boolean
    multiple?: {
      salariesSelected: SalaryPayroll[]
    }
  }
}
export type ModalAddOrUpdatePermanent = RequireOnlyOne<ModalPermanentSalaryData, 'add' | 'update'>
