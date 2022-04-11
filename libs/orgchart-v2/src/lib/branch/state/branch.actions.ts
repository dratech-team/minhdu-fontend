import { createAction, props } from '@datorama/akita-ng-effects';
import {AddBranchDto} from "../dto";
import {SearchBranchDto} from "../dto";
import {LoadOneBranchDto} from "../dto";
import {UpdateBranchDto} from "../dto";
import {RemoveBranchDto} from "../dto";
import {Salary} from "@minhdu-fontend/data-models";

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
  '[ORDER] Remove',
  props<RemoveBranchDto>()
);

const error = createAction(
  '[ORDER] Error',
  props<{ error: string }>()
);

const deleteAllowance = createAction(
  '[BRANCH] Delete Allowance',
  props<{salaryId: Salary['id']}>()
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
