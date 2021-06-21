import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducers';
import * as fromEmployee from './employee.reducers';
import { FeatureName } from '@minhdu-fontend/constants';

export const selectorEmployeeState = createFeatureSelector<EmployeeState>(
  FeatureName.EMPLOYEE
);
export const selectorAllEmployee = createSelector(
  selectorEmployeeState,
  fromEmployee.selectAll
);
export const selectedLoaded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
);
