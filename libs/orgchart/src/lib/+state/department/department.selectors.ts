import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DEPARTMENT_FEATURE_KEY,
  departmentAdapter,
  departmentState,
} from './department.reducer';
import { Department } from '@minhdu-fontend/data-models';

export const getDepartmentState = createFeatureSelector<departmentState>(
  DEPARTMENT_FEATURE_KEY
);

const { selectAll, selectEntities } = departmentAdapter.getSelectors();

export const getSelectedDepartmentId = (state: Department) => state.id;

export const getDepartmentLoaded = createSelector(
  getDepartmentState,
  (state: departmentState) => state.loaded
);

export const getDepartmentError = createSelector(
  getDepartmentState,
  (state: departmentState) => state.error
);

export const getAllDepartment = createSelector(getDepartmentState, selectAll);

export const getDepartmentByBranchId = (branchId: number) =>
  createSelector(getAllDepartment, (departmentEntities) => {
    return departmentEntities.filter(
      (department) => department.branchId === branchId
    );
  });

export const getDepartmentEntities = createSelector(
  getDepartmentState,
  selectEntities
);

export const getDepartmentById = (id: number) =>
  createSelector(
    getDepartmentEntities,
    (departmentEntities) => departmentEntities[id]
  );
