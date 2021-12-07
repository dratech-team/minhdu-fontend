import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction, updateStatePayroll } from './payroll.action';
import { Payroll } from './payroll.interface';
import { ConvertBoolean, ConvertBooleanFrontEnd, PayrollEnum } from '@minhdu-fontend/enums';

export interface PayrollState extends EntityState<Payroll> {
  loaded: boolean,
  added: boolean,
  adding: boolean,
  scanned: boolean,
  confirmed: boolean,
  deleted: boolean
  selectedPayrollId: number,
  createdAt: Date,
  filter: PayrollEnum,
  branch: string,
  position: string,
  total: number
}

export const adapter: EntityAdapter<Payroll> = createEntityAdapter<Payroll>();


export const initialPayroll = adapter.getInitialState({
  loaded: false, added: false, adding: false, scanned: false, confirmed: false, deleted: false,
  createdAt: new Date(), filter: PayrollEnum.TIME_SHEET, branch: '', position: '', total: 0
});

export const payrollReducer = createReducer(
  initialPayroll,
  on(PayrollAction.loadInit, (state, _) => {
    return { ...state, loaded: false };
  }),


  on(PayrollAction.loadInitSuccess, (state, action) => {
    return adapter.setAll(action.payrolls,
      { ...state, loaded: true, added: true, adding: false, total: action.total });
  }),

  on(PayrollAction.loadMorePayrollsSuccess, (state, action) => {
      return adapter.addMany(action.payrolls, { ...state, loaded: true, total: action.total });
    }
  ),

  on(PayrollAction.addPayroll, (state, _) => {
    return { ...state, adding: true, added: false };
  }),

  on(PayrollAction.addPayrollSuccess, (state, _) => {
      return { ...state, adding: false, added: true };
    }
  ),

  on(PayrollAction.getPayroll, (state, _) => {
    return { ...state, loaded: false };
  }),

  on(PayrollAction.getPayrollSuccess, (state, action) =>
    adapter.upsertOne(action.payroll, { ...state, loaded: true, added: true, adding: false, scanned: true })
  ),

  on(PayrollAction.updatePayrollSuccess, (state, { payroll }) => {
      return adapter.updateOne({ id: payroll.id, changes: payroll }, { ...state, loaded: true });
    }
  ),

  on(PayrollAction.deletePayrollSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, deleted: true, adding: false, total: state.total - 1 })),

  on(PayrollAction.confirmPayroll, (state, _) => {
    return { ...state, confirmed: false };
  }),

  on(PayrollAction.confirmPayrollSuccess, (state, action) =>
    adapter.updateOne({
        id: action.payroll.id,
        changes: {
          accConfirmedAt: action.payroll.accConfirmedAt,
          manConfirmedAt: action.payroll.manConfirmedAt,
          paidAt: action.payroll.paidAt,
          totalWorkday: action.payroll.totalWorkday
        }
      },
      {
        ...state, confirmed: true
      })),

  on(PayrollAction.handlePayrollError, (state, _) => {
      return { ...state, adding: false, added: false };
    }
  ),
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
  on(PayrollAction.updateStatePayroll, (state, { filter, createdAt, branch, added, position }) => {
    return {
      ...state,
      filter: filter ? filter : state.filter,
      createdAt: createdAt ? createdAt : state.createdAt,
      branch: branch ? branch : state.branch,
      position: position ? position : state.position,
      added: added && added === ConvertBooleanFrontEnd.TRUE ? true :
        added && added === ConvertBooleanFrontEnd.FALSE ? false : state.added
    };
  }),
  on(PayrollAction.updateSalaryMultipleSuccess, (state, _) => {
    return { ...state };
  }),
  on(PayrollAction.addSalaryMultipleSuccess, (state, _) => {
    return { ...state, added: true, adding: false };
  })
);


export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();


