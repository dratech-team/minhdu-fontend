import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from './payroll.reducers';
import * as fromPayroll from './payroll.reducers';
import * as fromOvertime from './overtime.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import { Payroll } from './payroll.interface';
import { overtimeState } from './overtime.reducer';

export interface State {
  payrolls: fromPayroll.PayrollState;
}

export const getSelectedPayrollId = (state: Payroll) => state.id;

export const selectorPayrollState = createFeatureSelector<PayrollState>(
  FeatureName.PAYROLL
);

export const selectorOvertimeState = createFeatureSelector<overtimeState>(
  FeatureName.OVERTIME
);

export const selectorPayrollEntities = createSelector(
  selectorPayrollState,
  fromPayroll.selectEntities
);

export const selectorAllPayroll = createSelector(
  selectorPayrollState,
  fromPayroll.selectAll
);

export const selectorOvertime = createSelector(
  selectorOvertimeState,
  fromOvertime.selectEntities
);

export const selectCurrentPayroll = (id: number) => createSelector(
  selectorPayrollEntities,
  (payrollEntities) => payrollEntities[id]
);

export const selectedLoadedPayroll = createSelector(
  selectorPayrollState,
  (state) => state.loaded
);

export const selectedLoadedSalary = createSelector(
  selectorOvertimeState,
  (state) => state.loaded
);

export const selectedAddingPayroll = createSelector(
  selectorPayrollState,
  (state) => state.adding
);

export const selectedAddedPayroll = createSelector(
  selectorPayrollState,
  (state) => state.added
);

export const selectedScannedPayroll = createSelector(
  selectorPayrollState,
  (state) => state.scanned
);
export const selectedConfirmedPayroll = createSelector(
  selectorPayrollState,
  (state) => state.confirmed
);
export const selectorPayrollTotal = createSelector(
  selectorPayrollState,
  fromPayroll.selectTotal
);
export const selectorIsTimeSheet= createSelector(
  selectorPayrollState,
  (state) => state.isTimeSheet
);

export const selectorSalaryTotal = createSelector(
  selectorOvertimeState,
  fromOvertime.selectTotal
);
