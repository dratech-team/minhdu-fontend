import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {RequireOnlyOne} from "../../../../shared/types";
import {BaseModalSalaryData, ModalUpdateSalary} from "./base-modal-salary.data";

export interface ModalPermanentSalaryData extends BaseModalSalaryData {
  type: SalaryTypeEnum.BASIC | SalaryTypeEnum.STAY | SalaryTypeEnum.BASIC_INSURANCE
  update: ModalUpdateSalary & { history?: boolean }
}

export type ModalAddOrUpdatePermanent = RequireOnlyOne<ModalPermanentSalaryData, 'add' | 'update'>
