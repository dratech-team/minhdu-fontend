import {BaseSalaryEntity} from '../base';
import {PayrollEntity} from "../../payroll/entities";
import {SalarySettingEntity} from "../../setting/salary/entities";

export interface PermanentSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity,
  readonly setting?: SalarySettingEntity
  readonly rate: number
}
