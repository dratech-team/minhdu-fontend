import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {SalarySettingEntity} from "../../setting/salary/entities";

export interface AllowanceSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly setting: SalarySettingEntity
  readonly unit: DatetimeUnitEnum;
  readonly rate: number
  readonly datetime: Date,
}
