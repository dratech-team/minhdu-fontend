import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {PayrollEntity} from "../entities";
import {EmployeeStatusEnum, EmployeeType, FilterTypeEnum, PaidType} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {BranchEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";
import {AccConfirmTypeEnums, PaidTypeEnums} from "../enums";

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  loading: boolean;
  added: boolean | null;
  search : {
    code?: string,
    name?: string
    branch?: BranchEntity;
    position?: PositionEntity
    employeeType: EmployeeType,
    empStatus: EmployeeStatusEnum,
    filterType: FilterTypeEnum,
    startedAt: Date,
    endedAt: Date,
    accConfirmed: AccConfirmTypeEnums,
    paidAt: PaidTypeEnums
  }
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
      endedAt: new Date(getLastDayInMonth(new Date()) + '-00'),
      accConfirmed: AccConfirmTypeEnums.ALL,
      paidAt: PaidTypeEnums.ALL
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'payroll'})
export class PayrollStore extends EntityStore<PayrollEntityState> {
  constructor() {
    super(createInitialState());
  }
}
