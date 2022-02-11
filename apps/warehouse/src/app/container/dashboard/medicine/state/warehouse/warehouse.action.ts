import { createAction, props } from '@datorama/akita-ng-effects';
import { Warehouse } from './entities/product.entity';

const loadWarehouses = createAction('[WAREHOUSE] Load Warehouses');

const selectedWarehouseId = createAction(
  '',
  props<{ warehouse: Warehouse }>()
);

export const WarehouseAction = {
  loadWarehouses,
  selectedWarehouseId
};
