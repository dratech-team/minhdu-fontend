import { RequireOnlyOne } from '../../../../shared/types';
import { BaseModalSalaryData } from './base-modal-salary.data';

export type ModalAddOrUpdateHoliday = RequireOnlyOne<
  BaseModalSalaryData,
  'add' | 'update'
>;
