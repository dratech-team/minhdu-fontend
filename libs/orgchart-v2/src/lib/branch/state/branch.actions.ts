import {createAction, props} from '@datorama/akita-ng-effects';
import {AddBranchDto, LoadOneBranchDto, RemoveBranchDto, SearchBranchDto, UpdateBranchDto} from "../dto";
import {AllowanceSalaryEntity} from "../../../../../../apps/hrv2/src/app/pages/salary/entities";

const addOne = createAction(
  '[Branch] Add One',
  props<AddBranchDto>()
);

const loadAll = createAction(
  '[Branch] Load All',
  props<SearchBranchDto>()
);

const loadOne = createAction(
  '[Branch] Load One',
  props<LoadOneBranchDto>()
);

const update = createAction(
  '[Branch] Update',
  props<UpdateBranchDto>()
);

const remove = createAction(
  '[Branch] Remove',
  props<RemoveBranchDto>()
);

const error = createAction(
  '[Branch] Error',
  props<{ error: string }>()
);

const deleteAllowance = createAction(
  '[BRANCH] Delete Allowance',
  props<{ salaryId: AllowanceSalaryEntity['id'] }>()
);

export const BranchActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
  deleteAllowance
};
