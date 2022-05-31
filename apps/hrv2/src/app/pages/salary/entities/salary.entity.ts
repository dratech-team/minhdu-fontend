import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {SalarySettingEntity} from "../../setting/salary/entities";
import {OvertimeSalaryEntity} from "./overtime-salary.entity";

export interface SalaryEntity extends BaseSalaryEntity {
  readonly payroll: PayrollEntity,
  readonly setting: SalarySettingEntity
  readonly partial?: PartialDayEnum;
  readonly allowance?: {
    title: string,
    price: number
  }
  readonly startedAt?: Date,
  readonly endedAt?: Date,
  readonly startTime?: Date,
  readonly endTime?: Date,
  readonly rate: number
  readonly inWorkday?: boolean,
  readonly inOffice?: boolean
  readonly total: number
  readonly duration: number
  expand: boolean
  readonly details: OvertimeSalaryEntity [],
}
