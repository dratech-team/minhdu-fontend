import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddWarehouseDto,
  RemoveWarehouseDto,
  UpdateWarehouseDto,
} from '../dto';

const addOne = createAction('[WAREHOUSE] Add One', props<AddWarehouseDto>());

const loadAll = createAction('[WAREHOUSE] Load All');

const update = createAction('[WAREHOUSE] Update', props<UpdateWarehouseDto>());

const remove = createAction('[WAREHOUSE] Remove', props<RemoveWarehouseDto>());

export const WarehouseAction = { loadAll, addOne, update, remove };
