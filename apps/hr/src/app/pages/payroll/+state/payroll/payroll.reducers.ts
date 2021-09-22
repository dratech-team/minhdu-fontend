import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction } from './payroll.action';
import { Payroll } from './payroll.interface';

export interface PayrollState extends EntityState <Payroll> {
  loaded: boolean,
  adding: boolean,
  selectedPayrollId: number
}

export const adapter: EntityAdapter<Payroll> = createEntityAdapter<Payroll>();

export const initialPayroll = adapter.getInitialState({ loaded: false, adding: false });

export const payrollReducer = createReducer(
  initialPayroll,
  on(PayrollAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.payrolls, { ...state, loaded: true })),

  on(PayrollAction.loadMorePayrollsSuccess, (state, action) =>
    adapter.addMany(action.payrolls, { ...state, loaded: true })),

  on(PayrollAction.addPayroll, (state, _) =>
  {return { ...state, adding: true }}),

  on(PayrollAction.addPayrollSuccess, (state, action) =>
    adapter.addOne(action.payroll, { ...state, adding: false })),

  on(PayrollAction.updatePayroll, (state, _) =>
  {return { ...state, adding: true }}),

  on(PayrollAction.getPayrollSuccess, (state, action) =>
    adapter.upsertOne(action.payroll, { ...state, adding: false })),

  on(PayrollAction.updatePayrollSuccess, (state, action) =>
    adapter.updateOne(action.payroll, { ...state, loaded: true })),

  on(PayrollAction.deletePayrollSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, loaded: true }))
);

export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

