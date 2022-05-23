import { PayrollEntity } from '../entities';
import { RemoteSalaryEntity } from '../../salary/entities';
import { SalaryPayroll } from '@minhdu-fontend/data-models';
import { RequireOnlyOne } from '../../../../shared/types';

export interface ModalRemoteSalaryData {
  add: {
    payroll: PayrollEntity,
    multiple: boolean
  }
  update: {
    salary: RemoteSalaryEntity
    multiple: {
      salariesSelected: SalaryPayroll[]
    }
  }
}

export type ModalAddOrUpdateRemoteData = RequireOnlyOne<ModalRemoteSalaryData, 'add' | 'update'>
