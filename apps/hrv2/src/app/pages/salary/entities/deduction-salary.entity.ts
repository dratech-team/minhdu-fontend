import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";

export interface DeductionSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly unit: DatetimeUnitEnum;
  readonly rate: number
}
