import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction, updateStatePayroll } from './payroll.action';
import { Payroll } from './payroll.interface';
import {
  ConvertBoolean,
  ConvertBooleanFrontEnd,
  FilterTypeEnum,
} from '@minhdu-fontend/enums';
import {
  Branch,
  Position,
  RangeDay,
  totalSalary,
} from '@minhdu-fontend/data-models';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';

export interface PayrollState extends EntityState<Payroll> {
  loaded: boolean;
  added: boolean;
  adding: boolean;
  scanned: boolean;
  confirmed: boolean;
  deleted: boolean;
  selectedPayrollId: number;
  rangeDay: RangeDay;
  filter: FilterTypeEnum;
  branch: Branch;
  position: Position;
  total: number;
  totalOvertime?: totalSalary;
  empStatus: number;
}

export const adapter: EntityAdapter<Payroll> = createEntityAdapter<Payroll>();

//fix-me hardcode datetime when update store
export const initialPayroll = adapter.getInitialState({
  loaded: false,
  added: false,
  adding: false,
  scanned: false,
  confirmed: false,
  deleted: false,
  rangeDay: {
    start: new Date(getFirstDayInMonth(new Date()) + '-00'),
    end: new Date(getLastDayInMonth(new Date()) + '-00'),
  } as RangeDay,
  filter: FilterTypeEnum.TIME_SHEET,
  branch: {} as Branch,
  position: {} as Position,
  total: 0,
  empStatus: 0,
  totalOvertime: { total: 0, unit: { days: 0, hours: 0 } },
});

export const payrollReducer = createReducer(
  initialPayroll,
  on(PayrollAction.loadInit, (state, _) => {
    return { ...state, loaded: false };
  }),

  on(PayrollAction.loadInitSuccess, (state, action) => {
    return adapter.setAll(action.payrolls, {
      ...state,
      loaded: true,
      added: true,
      adding: false,
      total: action.total,
      totalOvertime: action.totalOvertime
        ? action.totalOvertime
        : state.totalOvertime,
    });
  }),

  on(PayrollAction.loadMorePayrollsSuccess, (state, action) => {
    return adapter.addMany(action.payrolls, {
      ...state,
      loaded: true,
      total: action.total,
      totalOvertime:
        action.totalOvertime &&
        action.totalOvertime.total > 0 &&
        action.totalOvertime.unit.days > 0 &&
        action.totalOvertime.unit.days > 0
          ? action.totalOvertime
          : state.totalOvertime,
    });
  }),

  on(PayrollAction.addPayroll, (state, _) => {
    return { ...state, adding: true, added: false };
  }),

  on(PayrollAction.addPayrollSuccess, (state, _) => {
    return { ...state, adding: false, added: true };
  }),

  on(PayrollAction.getPayroll, (state, _) => {
    return { ...state, loaded: false };
  }),

  on(PayrollAction.getPayrollSuccess, (state, action) =>
    adapter.upsertOne(action.payroll, {
      ...state,
      loaded: true,
      added: true,
      adding: false,
      scanned: true,
    })
  ),

  on(PayrollAction.updatePayroll, (state, _) => {
    return { ...state, added: false, adding: true };
  }),

  on(PayrollAction.updatePayrollSuccess, (state, { payroll }) => {
    return adapter.updateOne(
      { id: payroll.id, changes: payroll },
      { ...state, loaded: true, added: true, adding: false }
    );
  }),

  on(PayrollAction.deletePayrollSuccess, (state, action) =>
    adapter.removeOne(action.id, {
      ...state,
      deleted: true,
      adding: false,
      total: state.total - 1,
    })
  ),

  on(PayrollAction.confirmPayroll, (state, _) => {
    return { ...state, confirmed: false };
  }),

  on(PayrollAction.confirmPayrollSuccess, (state, action) =>
    adapter.updateOne(
      {
        id: action.payroll.id,
        changes: {
          accConfirmedAt: action.payroll.accConfirmedAt,
          manConfirmedAt: action.payroll.manConfirmedAt,
          paidAt: action.payroll.paidAt,
          totalWorkday: action.payroll.totalWorkday,
        },
      },
      {
        ...state,
        confirmed: true,
      }
    )
  ),

  on(PayrollAction.handlePayrollError, (state, _) => {
    return { ...state, adding: false, added: false };
  }),
  on(PayrollAction.addSalary, (state, _) => {
    return { ...state, adding: true, added: false };
  }),

  on(PayrollAction.updateSalary, (state, _) => {
    return { ...state, adding: true, added: false };
  }),

  on(PayrollAction.handleSalaryError, (state, _) => {
    return { ...state, adding: false, deleted: false };
  }),

  on(PayrollAction.scanHoliday, (state, _) => {
    return { ...state, scanned: false };
  }),

  on(PayrollAction.scanHolidayError, (state, _) => {
    return { ...state, scanned: true };
  }),
  on(PayrollAction.deletePayroll, (state, _) => {
    return { ...state, adding: true, deleted: false };
  }),

  on(PayrollAction.deleteSalarySuccess, (state, _) => {
    return { ...state };
  }),
  //fix-me hardcode datetime when update store
  on(
    PayrollAction.updateStatePayroll,
    (state, { filter, rangeDay, added, empStatus }) => {
      return {
        ...state,
        empStatus: empStatus || empStatus === 0 ? empStatus : state.empStatus,
        filter: filter ? filter : state.filter,
        rangeDay: rangeDay
          ? {
              start: new Date(rangeDay.start + '-00'),
              end: new Date(rangeDay.end + '-00'),
            }
          : state.rangeDay,
        added:
          added && added === ConvertBooleanFrontEnd.TRUE
            ? true
            : added && added === ConvertBooleanFrontEnd.FALSE
            ? false
            : state.added,
      };
    }
  ),

  on(PayrollAction.updateStateBranch, (state, { branch }) => {
    return {
      ...state,
      branch: branch,
    };
  }),

  on(PayrollAction.updateStatePosition, (state, { position }) => {
    return {
      ...state,
      position: position,
    };
  }),

  on(PayrollAction.updateSalaryMultipleSuccess, (state, _) => {
    return { ...state };
  }),
  on(PayrollAction.addSalaryMultipleSuccess, (state, _) => {
    return { ...state, added: true, adding: false };
  })
);

export const { selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
