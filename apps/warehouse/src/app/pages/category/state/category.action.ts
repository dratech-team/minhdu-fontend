import { createAction, props } from '@datorama/akita-ng-effects';
import { AddCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from '../dto';

const addOne = createAction(
  '[CATEGORY] Add One',
  props<AddCategoryDto>()
);

const loadAll = createAction('[CATEGORY] Load All');

const update = createAction(
  '[CATEGORY] Update',
  props<UpdateCategoryDto>()
);

const remove = createAction(
  '[CATEGORY] Remove',
  props<RemoveCategoryDto>()
);

export const CategoryAction = { loadAll, addOne, update, remove };
