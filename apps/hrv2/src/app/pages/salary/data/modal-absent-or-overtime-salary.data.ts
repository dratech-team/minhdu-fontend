import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {RequireOnlyOne} from '../../../../shared/types';
import {BaseModalSalaryData} from "./base-modal-salary.data";

interface ModalAbsentOrOvertimeSalaryData extends BaseModalSalaryData {
  type: SalaryTypeEnum.ABSENT | SalaryTypeEnum.OVERTIME
}

export type ModalAddOrUpdateAbsentOrOvertime = RequireOnlyOne<ModalAbsentOrOvertimeSalaryData, 'add' | 'update'>
