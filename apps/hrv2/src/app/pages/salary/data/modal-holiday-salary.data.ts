import { PayrollEntity } from '../../payroll/entities';
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {RequireOnlyOne} from "../../../../shared/types";
import {RemoteSalaryEntity, SalaryEntity} from "../entities";
import {HolidaySalaryEntity} from "../entities/holiday-salary.entity";

export interface ModalHolidaySalaryData {
  add?: {
    payroll: PayrollEntity,
    salary?: SalaryEntity
    multiple?: boolean

  },
  update?: {
    salary: HolidaySalaryEntity,
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}
export type ModalAddOrUpdateHoliday = RequireOnlyOne<ModalHolidaySalaryData, 'add' | 'update'>
