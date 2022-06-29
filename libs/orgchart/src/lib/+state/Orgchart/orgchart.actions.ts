import { Branch } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ConvertBoolean } from '@minhdu-fontend/enums';

export const init = createAction('[branch Page] Init');

export const searchBranch = createAction(
  '[branch/API] Search branch',
  props<{
    branch?: string;
    position?: string;
    code?: number;
    search?: string;
    status?: ConvertBoolean;
  }>()
);

export const loadOrgchartSuccess = createAction(
  '[branch/API] Load branch Success',
  props<{ branches: Branch[] }>()
);

export const getBranch = createAction(
  '[branch/API] get Branch',
  props<{ id?: number; branch?: string }>()
);
export const getBranchSuccess = createAction(
  '[branch/API] get Branch Success',
  props<{ branch: Branch }>()
);

export const addBranch = createAction(
  '[branch/API] Add Branch',
  props<{ branch: { name: string; positionIds?: number[] } }>()
);

export const addBranchSuccess = createAction(
  '[branch/API] Add Branch success',
  props<{ branch: Branch }>()
);

export const updateBranch = createAction(
  '[branch/API] Update Branch',
  props<{ id: number; updateBranchDto: UpdateBranchDto }>()
);

export const updateBranchSuccess = createAction(
  '[branch/API] Update Branch Success',
  props<{ branch: Branch }>()
);

export const deleteBranch = createAction(
  '[branch/API] Delete Branch',
  props<{ id: number }>()
);

export const deleteAllowanceInBranch = createAction(
  '[branch/API] Delete Allowance in Branch',
  props<{ salaryId: number }>()
);

export const loadOrgchartFailure = createAction(
  '[branch/API] Load branch Failure',
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
  updateBranchSuccess,
  deleteBranch,
  loadOrgchartFailure,
  deleteAllowanceInBranch,
};
