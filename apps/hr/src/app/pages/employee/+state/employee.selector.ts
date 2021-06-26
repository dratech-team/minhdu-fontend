import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducers';
import { Employee } from './employee.interface';
import * as fromEmployee from './employee.reducers';
import { FeatureName } from '@minhdu-fontend/constants';

export interface State {
  employees: fromEmployee.EmployeeState;
}

export const getSelectedEmployeeId = (state: Employee) => state.id
export const selectorEmployeeState = createFeatureSelector<EmployeeState>(
  FeatureName.EMPLOYEE
);

export const selectorEmployeeEntities = createSelector(
  selectorEmployeeState,
  fromEmployee.selectEntities,
);

export const selectorAllEmployee = createSelector(
  selectorEmployeeState,
  fromEmployee.selectAll
);

export const selectCurrentEmployee = (id: number) =>  createSelector(
  selectorEmployeeEntities,
  (employeeEntities) => employeeEntities[id]
);

export const selectedLoaded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
);
