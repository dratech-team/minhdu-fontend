import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {PayrollEntity} from "../entities";
import {EmployeeStatusEnum, EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {BranchEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";
import {confirmTypeEnums, PaidTypeEnums} from "../enums";

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  loading: boolean;
  added: boolean | null;
  scanned: boolean|null
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
    accConfirmed: confirmTypeEnums,
    manConfirmedAt: confirmTypeEnums,
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
      accConfirmed: confirmTypeEnums.ALL,
      manConfirmedAt: confirmTypeEnums.ALL,
      paidAt: PaidTypeEnums.ALL
    },
    scanned: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'payroll'})
export class PayrollStore extends EntityStore<PayrollEntityState> {
  constructor() {
    super(createInitialState());
  }
}
