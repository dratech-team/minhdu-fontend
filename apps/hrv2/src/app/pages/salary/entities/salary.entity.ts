import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {SalarySettingEntity} from "../../setting/salary/entities";

export interface SalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly setting?: SalarySettingEntity
  readonly partial?: PartialDayEnum;
  readonly rate: number
}
