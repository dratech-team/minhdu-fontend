import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducer';
import * as fromEmployee from './employee.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import { Employee } from '@minhdu-fontend/data-models';
export interface State {employees: fromEmployee.EmployeeState;}


export const selectorEmployeeState = createFeatureSelector<EmployeeState>(
  FeatureName.EMPLOYEE
);
export const getSelectedEmployeeId = (state: Employee) => state.id;

export const selectorEmployeeEntities = createSelector(
  selectorEmployeeState,
  fromEmployee.selectEntities
);

export const selectorAllEmployee = createSelector(
  selectorEmployeeState,
  fromEmployee.selectAll
);

export const selectCurrentEmployee = (id: number) => createSelector(
  selectorEmployeeEntities,
  (employeeEntities) => employeeEntities[id]
);

export const selectedLoaded = createSelector(
  selectorEmployeeState,
  (state) => state.loaded
);
