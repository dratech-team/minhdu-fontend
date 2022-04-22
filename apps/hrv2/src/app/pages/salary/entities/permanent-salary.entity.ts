import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";

export interface PermanentSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly payrollId: number
  readonly rate: number
}
