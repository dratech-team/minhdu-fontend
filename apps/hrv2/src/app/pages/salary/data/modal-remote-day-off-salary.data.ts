import {PayrollEntity} from '../../payroll/entities';
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {RequireOnlyOne} from "../../../../shared/types";
import {RemoteSalaryEntity, SalaryEntity} from "../entities";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {DayOffSalaryEntity} from "../entities/day-off-salary.entity";

export interface ModalRemoteOrDayOffSalaryData {
  type: SalaryTypeEnum.DAY_OFF | SalaryTypeEnum.WFH
  add?: {
    payroll: PayrollEntity,
    multiple?: boolean

  },
  update?: {
    salary: RemoteSalaryEntity | DayOffSalaryEntity,
    multiple?: {
      salaries: SalaryEntity[]
    },
  }
}

export type ModalAddOrUpdateRemoteOrDayOff = RequireOnlyOne<ModalRemoteOrDayOffSalaryData, 'add' | 'update'>
