import { RequireOnlyOne } from '../../../../shared/types';
import {
  BaseModalSalaryData,
  ModalUpdateSalary,
} from './base-modal-salary.data';

export interface ModalAllowanceSalaryData extends BaseModalSalaryData {
  update: ModalUpdateSalary & { salary: { workedAt: Date } };
}

export type ModalAddOrUpdateAllowance = RequireOnlyOne<
  ModalAllowanceSalaryData,
  'add' | 'update'
>;
