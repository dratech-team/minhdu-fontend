import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPayroll from './payroll.reducers';
import { PayrollState } from './payroll.reducers';
import * as fromOvertime from './overtime.reducer';
import { overtimeState } from './overtime.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import { Payroll } from './payroll.interface';
import { EmployeeType } from '@minhdu-fontend/enums';

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

export const selectorAllPayrollSeasonal = createSelector(
  selectorAllPayroll,
  (payrolls) =>{
   return   payrolls.filter(payroll =>
     payroll.employee.type === EmployeeType.EMPLOYEE_SEASONAL
    )
  }
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

export const selectedDeletedPayroll = createSelector(
  selectorPayrollState,
  (state) => state.deleted
);

export const selectorSalaryTotal = createSelector(
  selectorOvertimeState,
  fromOvertime.selectTotal
);
