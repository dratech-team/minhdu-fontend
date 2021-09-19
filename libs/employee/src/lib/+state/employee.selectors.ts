import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducer';
import * as fromEmployee from './employee.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import { Employee } from '@minhdu-fontend/data-models';
export interface State {
  employees: fromEmployee.EmployeeState;
}

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

export const selectCurrentEmployee = (id: number) =>
  createSelector(
    selectorEmployeeEntities,
    (employeeEntities) => employeeEntities[id]
  );

export const selectEmployeeLoaded = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.loaded;
  }
);

export const selectEmployeeError = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.loaded;
  }
);

export const selectorEmployeeTotal = createSelector(
  selectorEmployeeState,
  fromEmployee.selectTotal
);
