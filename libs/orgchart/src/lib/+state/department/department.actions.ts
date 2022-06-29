import { Department } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';

export const loadDepartment = createAction('[Department/API] Load Department');

export const loadDepartmentSuccess = createAction(
  '[Department/API] Load Department Success',
  props<{ departments: Department[] }>()
);

export const addDepartment = createAction(
  '[Department/API] Add Department',
  props<{ department: { name: string; branchId: number } }>()
);

export const getDepartment = createAction(
  '[Department/API] get Department Success',
  props<{ id: number }>()
);

export const updateDepartment = createAction(
  '[Department/API] Update Department',
  props<{ id: number; name: string }>()
);

export const deleteDepartment = createAction(
  '[Department/API] Delete Department',
  props<{ id: number }>()
);
export const loadDepartmentFailure = createAction(
  '[Department/API] Load Department Failure',
  props<{ error: any }>()
);

export const DepartmentActions = {
  getDepartment,
  loadDepartment,
  loadDepartmentSuccess,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  loadDepartmentFailure,
};
