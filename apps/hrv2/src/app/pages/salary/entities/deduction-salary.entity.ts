import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {SalarySettingEntity} from "../../setting/salary/entities";

export interface DeductionSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly setting?: SalarySettingEntity
  readonly partial?: PartialDayEnum;
  readonly unit: DatetimeUnitEnum;
  readonly rate: number
  readonly startedAt?: Date,
  readonly endedAt?: Date
}
