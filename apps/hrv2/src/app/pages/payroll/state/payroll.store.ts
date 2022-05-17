import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {PayrollEntity} from "../entities";
import {EmployeeStatusEnum, EmployeeType, FilterTypeEnum} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {BranchEntity, DepartmentEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";
import {confirmTypeEnums, PaidTypeEnums} from "../enums";

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  loading: boolean;
  loadMore: boolean;
  total: number
  added: boolean | null;
  scanned: boolean | null
  deleted: boolean | null
  search: {
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
    paidAt: PaidTypeEnums,
    department?: DepartmentEntity
  }
  searchHistory:{
    code?: string,
    name?: string,
    branch?: BranchEntity,
    position?:PositionEntity,
    rangeDay: Date []
    accConfirmed?: confirmTypeEnums,
    manConfirmedAt?: confirmTypeEnums,
    paidAt?: PaidTypeEnums,
  }
}

export function createInitialState(): PayrollEntityState {
  return {
    total: 0,
    loading: true,
    loadMore: false,
    added: null,
    deleted: null,
    search: {
      employeeType: EmployeeType.EMPLOYEE_FULL_TIME,
      empStatus: EmployeeStatusEnum.IS_ACTIVE,
      filterType: FilterTypeEnum.PAYROLL,
      startedAt: new Date(getFirstDayInMonth(new Date()) + '-00'),
      endedAt: new Date(getLastDayInMonth(new Date()) + '-00'),
      accConfirmed: confirmTypeEnums.ALL,
      manConfirmedAt: confirmTypeEnums.ALL,
      paidAt: PaidTypeEnums.ALL
    },
    searchHistory:{
      rangeDay: [
        new Date(new Date().getFullYear(), 0, 1),
        new Date()
      ]
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
