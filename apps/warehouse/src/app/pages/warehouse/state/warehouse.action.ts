import { createAction, props } from '@datorama/akita-ng-effects';
import { Warehouse } from '../entities';
import { WarehouseDtoEntity } from '../dto';

const loadAll = createAction('[WAREHOUSE] Load Warehouses');

const addOne = createAction(
  '[WAREHOUSE] Add Warehouses',
  props<{ warehouse: WarehouseDtoEntity }>()
);

const selectedWarehouseId = createAction(
  '[WAREHOUSE] Selected Warehouse',
  props<{ warehouseId: Warehouse['id'] }>()
);

export const WarehouseAction = { loadAll, selectedWarehouseId, addOne };
