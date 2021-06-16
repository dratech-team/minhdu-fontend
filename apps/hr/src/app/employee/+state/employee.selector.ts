import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducers';
import * as fromEmployee from './employee.reducers';
import { Feature } from '../../../../../../libs/shared/constants/feature.constant';

export const selectorEmployeeState = createFeatureSelector<EmployeeState>(
  Feature.EMPLOYEE
);
export const selectorAllEmployee = createSelector(
  selectorEmployeeState,
  fromEmployee.selectAll
);
export const selectedLoaded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
);
