import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction } from './payroll.action';
import { Payroll } from './payroll.interface';

export interface PayrollState extends EntityState <Payroll> {
  loaded: boolean,
  added: boolean,
  adding: boolean,
  scanned: boolean,
  confirmed: boolean,
  selectedPayrollId: number,
}


export const adapter: EntityAdapter<Payroll> = createEntityAdapter<Payroll>();

export const initialPayroll = adapter.getInitialState({
  loaded: false, added: false, adding: false, scanned: false, confirmed: false
});

export const payrollReducer = createReducer(
  initialPayroll,
  on(PayrollAction.loadInit, (state, _) => {
    return { ...state, loaded: false };
  }),

  on(PayrollAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.payrolls,
      { ...state, loaded: true, added: true, adding: false })),

  on(PayrollAction.loadMorePayrollsSuccess, (state, action) =>
    adapter.addMany(action.payrolls, { ...state, loaded: true})),

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

  on(PayrollAction.updatePayrollSuccess, (state, action) =>
    adapter.updateOne(action.payroll, { ...state, loaded: true })),

  on(PayrollAction.deletePayrollSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, loaded: true })),

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
    return { ...state, adding: false };
  }),

  on(PayrollAction.scanHoliday, (state, _) => {
    return { ...state, scanned: false };
  }),

  on(PayrollAction.scanHolidayError, (state, _) => {
    return { ...state, scanned: true };
  })
);


export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();


