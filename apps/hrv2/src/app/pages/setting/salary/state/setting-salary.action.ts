import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddSettingSalaryDto,
  LoadOneSalarySettingDto,
  RemoveSettingSalary,
  SearchSettingSalaryDto,
  UpdateSettingSalaryDto
} from "../dto";

const addOne = createAction(
  '[SETTING_SALARY] Add One',
  props<AddSettingSalaryDto>()
);

const loadAll = createAction(
  '[SETTING_SALARY] Load All',
  props<SearchSettingSalaryDto>()
);

const getOne = createAction(
  '[SETTING_SALARY] Get One',
  props<LoadOneSalarySettingDto>()
);

const update = createAction(
  '[SETTING_SALARY] Update',
  props<UpdateSettingSalaryDto>()
);

const remove = createAction(
  '[SETTING_SALARY] Delete',
  props<RemoveSettingSalary>()
);

const error = createAction(
  '[SETTING_SALARY] Error',
  props<{ error: string }>()
);

export const SettingSalaryActions = { addOne, loadAll, getOne, update, remove, error };
