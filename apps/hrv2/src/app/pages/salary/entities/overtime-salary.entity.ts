import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {SalarySettingEntity} from "../../setting/salary/entities";

export interface OvertimeSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly setting: SalarySettingEntity
  readonly partial: PartialDayEnum;
  readonly rate: number
  readonly allowance?: {
    title: string,
    price: number
  }
  readonly startedAt: Date,
  readonly endedAt: Date,
  readonly datetime: Date
  readonly duration: number,
  readonly total: number
}
