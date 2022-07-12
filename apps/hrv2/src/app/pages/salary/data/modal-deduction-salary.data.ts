import { RequireOnlyOne } from '../../../../shared/types';
import { BaseModalSalaryData } from './base-modal-salary.data';

export type ModalAddOrUpdateDeduction = RequireOnlyOne<
  BaseModalSalaryData,
  'add' | 'update'
>;
