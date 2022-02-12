import { createAction, props } from '@datorama/akita-ng-effects';
import { Warehouse } from './entities/product.entity';
import { WarehouseDtoEntity } from './entities/warehouse-dto.entity';

const loadWarehouses = createAction('[WAREHOUSE] Load Warehouses');

const addWarehouse = createAction(
  '[WAREHOUSE] Load Warehouses',
  props<{ warehouse: WarehouseDtoEntity }>()
);

const selectedWarehouseId = createAction(
  '[WAREHOUSE] Selected Warehouse',
  props<{ warehouseId: Warehouse['id'] }>()
);

export const WarehouseAction = {
  loadWarehouses,
  selectedWarehouseId
};
