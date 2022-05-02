import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {SalarySettingEntity} from "../../setting/salary/entities";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";

export interface AllowanceSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly rate: number
  readonly startedAt: Date,
  readonly endedAt: Date,
  readonly branch?: BranchEntity
  readonly inWorkday: boolean,
  readonly inOffice: boolean
}
