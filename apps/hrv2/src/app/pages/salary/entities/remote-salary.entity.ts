import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {PartialDayEnum} from "@minhdu-fontend/data-models";

export interface RemoteSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly rate: number
  readonly startedAt: Date,
  readonly endedAt: Date
  readonly partial: PartialDayEnum
}
