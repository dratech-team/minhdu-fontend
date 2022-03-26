import { createAction, props } from '@datorama/akita-ng-effects';
import { AddWarehouseDto } from '../dto';

const loadAll = createAction('[WAREHOUSE] Load Warehouses');

const addOne = createAction(
  '[WAREHOUSE] Add Warehouses',
  props<AddWarehouseDto>()
);

export const WarehouseAction = { loadAll, addOne };
