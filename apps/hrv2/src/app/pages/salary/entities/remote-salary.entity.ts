import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";

export interface RemoteSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly rate: number
  readonly startedAt: Date,
  readonly endedAt: Date
}
