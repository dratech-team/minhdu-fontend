import { createAction, props } from '@datorama/akita-ng-effects';
import {AddSalarySettingDto, SearchSettingSalaryDto, UpdateSettingSalaryDto} from '../dto';
import { SettingSalaryEntity } from '../entities';

const addOne = createAction(
  '[SETTING_SALARY] Add One',
  props<AddSalarySettingDto>()
);

const loadAll = createAction(
  '[SETTING_SALARY] Load All',
  props<SearchSettingSalaryDto>()
);

const getOne = createAction(
  '[SETTING_SALARY] Get One',
  props<{ id: SettingSalaryEntity['id'] }>()
);

const update = createAction(
  '[SETTING_SALARY] Update',
  props<UpdateSettingSalaryDto>()
);

const remove = createAction(
  '[SETTING_SALARY] Delete',
  props<{ id: SettingSalaryEntity['id'] }>()
);

const error = createAction(
  '[SETTING_SALARY] Error',
  props<{ error: string }>()
);

export const SettingSalaryActions = { addOne, loadAll, getOne, update, remove, error };
