import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from '../reducers/employee.reducers';
import * as fromEmployee from '../reducers/employee.reducers';
import { Feature } from '../../../../../../libs/shared/constants/feature.constant';

export const selectorEmployeeState = createFeatureSelector<EmployeeState>(
  Feature.EMPLOYEE
)
export const selectorAllEmployee = createSelector(
  selectorEmployeeState,
  fromEmployee.selectAll
)
export const selectedLoaded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
)
export const selectedAdded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
)
