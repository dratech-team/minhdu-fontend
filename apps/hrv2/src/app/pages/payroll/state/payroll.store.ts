import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {PayrollEntity} from "../entities";
import {BaseSearchPayrollDto} from "../dto";
import {EmployeeStatusEnum, EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {BranchEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  loading: boolean;
  added: boolean | null;
  search: Partial<BaseSearchPayrollDto>;
  branch?: BranchEntity;
  position?: PositionEntity
  selectedPayroll: FilterTypeEnum
}

export function createInitialState(): PayrollEntityState {
  return {
    loading: true,
    added: null,
    search: {
      employeeType: EmployeeType.EMPLOYEE_FULL_TIME,
      empStatus: EmployeeStatusEnum.IS_ACTIVE,
      filterType: FilterTypeEnum.TIME_SHEET,
      startedAt: new Date(getFirstDayInMonth(new Date()) + '-00'),
      endedAt: new Date(getLastDayInMonth(new Date()) + '-00')
    },
    selectedPayroll: FilterTypeEnum.TIME_SHEET
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'payroll'})
export class PayrollStore extends EntityStore<PayrollEntityState> {
  constructor() {
    super(createInitialState());
  }
}
