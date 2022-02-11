import { createAction, props } from '@datorama/akita-ng-effects';
import { Warehouse } from './entities/product.entity';

const loadWarehouses = createAction('[WAREHOUSE] Load Warehouses');

const selectedWarehouseId = createAction(
  '[WAREHOUSE] Selected Warehouse',
  props<{ warehouseId: Warehouse['id'] }>()
);

export const WarehouseAction = {
  loadWarehouses,
  selectedWarehouseId
};
