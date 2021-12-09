import { FeatureName } from '@minhdu-fontend/constants';
import { Employee } from '@minhdu-fontend/data-models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEmployee from './employee.reducer';
import { EmployeeState } from './employee.reducer';
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

export const selectEmployeeAdding = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.adding;
  }
);

export const selectEmployeeAdded = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.added;
  }
);

export const selectEmployeeError = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.loaded;
  }
);

export const selectEmployeeDeleted = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.deleted;
  }
);

export const selectorEmployeeTotal = createSelector(
  selectorEmployeeState,
  fromEmployee.selectTotal
);

export const selectorScrollXTotal = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.scrollX;
  }
);

export const selectorTotalEmployee = createSelector(
  selectorEmployeeState,
  (state) => {
    return state.total;
  }
);
