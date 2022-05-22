import {PayrollEntity} from "../../payroll/entities";
import {SalarySettingEntity} from "../../setting/salary/entities";
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface HolidaySalaryEntity extends BaseEntity {
  readonly payroll?: PayrollEntity,
  readonly payrollId: number
  readonly setting: SalarySettingEntity
  readonly duration: number
  readonly note?: string
  readonly total: number;
  readonly details: HolidaySalaryEntity & { price: number }[]
  expand: boolean
}
