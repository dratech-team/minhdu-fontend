import { createAction, props } from '@ngrx/store';
import { BranchEntity } from './orgchart.models';

export const init = createAction('[Orgchart Page] Init');

export const loadOrgchartSuccess = createAction(
  '[Orgchart/API] Load Orgchart Success',
  props<{ branches: BranchEntity[] }>()
);

export const addBranch = createAction(
  '[Orgchart/API] Add Branch',
  props<{ name: string }>()
);

export const updateBranch = createAction(
  '[Orgchart/API] Update Branch',
  props<{ id: number, name: string }>()
);

export const addDepartment = createAction(
  '[Orgchart/API] Add Department',
  props<{ name: string, branchId: number }>()
);

export const updateDepartment = createAction(
  '[Orgchart/API] Update Department',
  props<{ id: number, name: string }>()
);

export const addPosition = createAction(
  '[Orgchart/API] Add Position',
  props<{ name: string, workday: number, departmentId: number }>()
);

export const updatePosition = createAction(
  '[Orgchart/API] Update Position',
  props<{ id: number, name: string }>()
);

export const loadOrgchartFailure = createAction(
  '[Orgchart/API] Load Orgchart Failure',
  props<{ error: any }>()
);

export const OrgchartActions = {
  init,
  loadOrgchartSuccess,
  addBranch,
  updateBranch,
  addDepartment,
  updateDepartment,
  addPosition,
  updatePosition,
  loadOrgchartFailure
};
