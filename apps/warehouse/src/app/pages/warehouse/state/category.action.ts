import { createAction, props } from '@datorama/akita-ng-effects';
import { AddWarehouseDto, RemoveCategoryDto, UpdateCategoryDto } from '../dto';

const addOne = createAction(
  '[CATEGORY] Add One',
  props<AddWarehouseDto>()
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
