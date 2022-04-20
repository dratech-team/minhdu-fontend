import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";

export interface PermanentSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly rate: number
}
