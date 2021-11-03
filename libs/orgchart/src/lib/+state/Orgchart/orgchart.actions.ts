import { Branch } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Orgchart Page] Init');

export const searchBranch = createAction(
  '[Orgchart/API] Search branch',
  props<{ branch: string }>()
);

export const loadOrgchartSuccess = createAction(
  '[Orgchart/API] Load Orgchart Success',
  props<{ branches: Branch[] }>()
);

export const getBranch = createAction(
  '[Orgchart/API] get Branch',
  props<{ id: number }>()
);
export const getBranchSuccess = createAction(
  '[Orgchart/API] get Branch Success',
  props<{ branch: Branch }>()
);

export const addBranch = createAction(
  '[Orgchart/API] Add Branch',
  props<{ branch: { name: string } }>()
);

export const addBranchSuccess = createAction(
  '[Orgchart/API] Add Branch success',
  props<{ branch: Branch }>()
);

export const updateBranch = createAction(
  '[Orgchart/API] Update Branch',
  props<{ id: number, name: string }>()
);

export const deleteBranch = createAction(
  '[Orgchart/API] Delete Branch',
  props<{ id: number }>()
);

export const loadOrgchartFailure = createAction(
  '[Orgchart/API] Load Orgchart Failure',
  props<{ error: any }>()
);


export const OrgchartActions = {
  getBranch,
  init,
  searchBranch,
  loadOrgchartSuccess,
  addBranch,
  addBranchSuccess,
  updateBranch,
  deleteBranch,
  loadOrgchartFailure
};
