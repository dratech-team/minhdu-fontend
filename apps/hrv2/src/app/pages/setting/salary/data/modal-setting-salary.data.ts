import {SalarySettingEntity} from "../entities";
import {RequireOnlyOne} from "../../../../../shared/types";

export interface ModalSettingSalaryData {
  add?: {
    template?: SalarySettingEntity
  }
  update?: {
    template: SalarySettingEntity
  }
}

export type AddOrUpdateSettingSalary = RequireOnlyOne<ModalSettingSalaryData, 'add' | 'update'>
