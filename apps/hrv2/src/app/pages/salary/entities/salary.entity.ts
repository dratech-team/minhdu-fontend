import {BaseSalaryEntity} from '../base';
import {Payroll} from "../../../../../../hr/src/app/pages/payroll/+state/payroll/payroll.interface";

export interface SalaryEntity extends BaseSalaryEntity {
  readonly datetime: Date
  readonly payroll: Payroll,

  // readonly setting: SalarySetting
}
