import { createAction, props } from '@datorama/akita-ng-effects';
import { WarehouseDtoEntity } from '../dto';

const loadAll = createAction('[WAREHOUSE] Load Warehouses');

const addOne = createAction(
  '[WAREHOUSE] Add Warehouses',
  props<{ warehouse: WarehouseDtoEntity }>()
);

export const WarehouseAction = { loadAll, addOne };
