import { createAction, props } from '@datorama/akita-ng-effects';
import { AddWarehouseDto, RemoveWarehouseDto, UpdateWarehouseDto } from '../dto';

const addOne = createAction(
  '[CATEGORY] Add One',
  props<AddWarehouseDto>()
);

const loadAll = createAction('[CATEGORY] Load All');

const update = createAction(
  '[CATEGORY] Update',
  props<UpdateWarehouseDto>()
);

const remove = createAction(
  '[CATEGORY] Remove',
  props<RemoveWarehouseDto>()
);

export const WarehouseAction = { loadAll, addOne, update, remove };
