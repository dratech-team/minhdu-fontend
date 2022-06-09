import {BaseRateConditionEntity} from "../bases/base-rate-condition.entity";
import {SalarySettingEntity} from "./salary-setting.entity";

export interface RateConditionEntity extends BaseRateConditionEntity {
  settings: SalarySettingEntity[]
}
