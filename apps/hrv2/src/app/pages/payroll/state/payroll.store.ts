import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PayrollEntity } from '../entities';
import {
  EmployeeStatusEnum,
  EmployeeType,
  FilterTypeEnum,
} from '@minhdu-fontend/enums';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { BranchEntity, PositionEntity } from '@minhdu-fontend/orgchart-v2';
import { ConfirmStatus, PaidStatus } from '../enums';
import { BaseSearchPayrollDto } from '../dto';

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  total: number;
  loading?: boolean;
  remain: number;
  totalSalary: number;
  expandAll: boolean;
  search: BaseSearchPayrollDto;
  searchHistory: {
    code?: string;
    name?: string;
    branch?: BranchEntity;
    position?: PositionEntity;
    rangeDay: Date[];
    accConfirmed?: ConfirmStatus;
    manConfirmedAt?: ConfirmStatus;
    paidAt?: PaidStatus;
  };
}

export function createInitialState(): PayrollEntityState {
  return {
    total: 0,
    remain: 0,
    totalSalary: 0,
    expandAll: true,
    search: {
      employeeType: EmployeeType.FULL_TIME,
      empStatus: EmployeeStatusEnum.IS_ACTIVE,
      filterType: FilterTypeEnum.TIME_SHEET,
      startedAt: new Date(getFirstDayInMonth(new Date()) + '-00'),
      endedAt: new Date(getLastDayInMonth(new Date()) + '-00'),
      accConfirmed: ConfirmStatus.ALL,
      manConfirmedAt: ConfirmStatus.ALL,
      paidAt: PaidStatus.ALL,
    },
    searchHistory: {
      rangeDay: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      accConfirmed: ConfirmStatus.ALL,
      manConfirmedAt: ConfirmStatus.ALL,
      paidAt: PaidStatus.ALL,
    },
    scanned: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'payroll' })
export class PayrollStore extends EntityStore<PayrollEntityState> {
  constructor() {
    super(createInitialState());
  }
}
