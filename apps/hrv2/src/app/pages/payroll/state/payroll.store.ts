import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {PayrollEntity} from "../entities";
import {BaseSearchPayrollDto} from "../dto";
import {RangeDay} from "@minhdu-fontend/data-models";
import {FilterTypeEnum, StatusEnum} from "@minhdu-fontend/enums";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";

export interface PayrollEntityState extends EntityState<PayrollEntity> {
  loading: boolean;
  added: boolean | null;
  search: Partial<BaseSearchPayrollDto>;
  empStatus: number,
  filter: FilterTypeEnum;
  rangeDay: RangeDay;
}

export function createInitialState(): PayrollEntityState {
  return {
    loading: true,
    added: null,
    search: {},
    empStatus: StatusEnum.FALSE,
    filter: FilterTypeEnum.TIME_SHEET,
    rangeDay: {
      start: new Date(getFirstDayInMonth(new Date()) + '-00'),
      end: new Date(getLastDayInMonth(new Date()) + '-00')
    },
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'payroll'})
export class PayrollStore extends EntityStore<PayrollEntityState> {
  constructor() {
    super(createInitialState());
  }
}
