import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddBranchDto,
  LoadOneBranchDto,
  RemoveBranchDto,
  SearchBranchDto,
  UpdateBranchDto,
} from '../dto';

const addOne = createAction('[Branch] Add One', props<AddBranchDto>());

const loadAll = createAction(
  '[Branch] Load All',
  props<Partial<SearchBranchDto>>()
);

const loadOne = createAction('[Branch] Load One', props<LoadOneBranchDto>());

const update = createAction('[Branch] Update', props<UpdateBranchDto>());

const remove = createAction('[Branch] Remove', props<RemoveBranchDto>());

const error = createAction('[Branch] Error', props<{ error: string }>());

const deleteAllowance = createAction(
  '[BRANCH] Delete Allowance',
  props<{ salaryId: number }>()
);

export const BranchActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
  deleteAllowance,
};
