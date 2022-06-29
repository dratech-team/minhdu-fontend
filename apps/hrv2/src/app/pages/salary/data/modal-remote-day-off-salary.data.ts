import { RequireOnlyOne } from '../../../../shared/types';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { BaseModalSalaryData } from './base-modal-salary.data';

export interface ModalRemoteOrDayOffSalaryData extends BaseModalSalaryData {
  type: SalaryTypeEnum.DAY_OFF | SalaryTypeEnum.WFH;
}

export type ModalAddOrUpdateRemoteOrDayOff = RequireOnlyOne<
  ModalRemoteOrDayOffSalaryData,
  'add' | 'update'
>;
