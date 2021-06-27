import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Orgchart Page] Init');

export const loadOrgchartSuccess = createAction(
  '[Orgchart/API] Load Orgchart Success',
  props<{ branches: Branch[] }>()
);

export const addBranch = createAction(
  '[Orgchart/API] Add Branch',
  props<{ branch: Branch }>()
);

export const updateBranch = createAction(
  '[Orgchart/API] Update Branch',
  props<{ id: number, name: string }>()
);

export const deleteBranch = createAction(
  '[Orgchart/API] Update Branch',
  props<{ id: number }>()
);

export const addDepartment = createAction(
  '[Orgchart/API] Add Department',
  props<{ department: Department }>()
);

export const updateDepartment = createAction(
  '[Orgchart/API] Update Department',
  props<{ id: number, name: string }>()
);

export const deleteDepartment = createAction(
  '[Orgchart/API] Delete Department',
  props<{ id: number }>()
);

export const addPosition = createAction(
  '[Orgchart/API] Add Position',
  props<{ position: Position }>()
);

export const updatePosition = createAction(
  '[Orgchart/API] Update Position',
  props<{ id: number, name: string, workday: number }>()
);

export const deletePosition = createAction(
  '[Orgchart/API] Delete Position ',
  props<{ id: number }>()
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
  deleteBranch,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addPosition,
  updatePosition,
  deletePosition,
  loadOrgchartFailure
};
