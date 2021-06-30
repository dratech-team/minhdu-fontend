import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from './payroll.reducers';
import * as fromPayroll from './payroll.reducers'
import { FeatureName } from '@minhdu-fontend/constants';
import { Payroll } from './payroll.interface';

export interface State {
  payrolls: fromPayroll.PayrollState;
}

export const getSelectedPayrollId = (state: Payroll) => state.id
export const selectorPayrollState = createFeatureSelector<PayrollState>(
  FeatureName.PAYROLL
);

export const selectorPayrollEntities = createSelector(
  selectorPayrollState,
  fromPayroll.selectEntities,
);

export const selectorAllPayroll = createSelector(
  selectorPayrollState,
  fromPayroll.selectAll
);

export const selectCurrentPayroll = (id: number) =>  createSelector(
  selectorPayrollEntities,
  (payrollEntities) => payrollEntities[id]
);

export const selectedLoaded = createSelector(
  selectorPayrollState,
  (state) => state.loaded
);
