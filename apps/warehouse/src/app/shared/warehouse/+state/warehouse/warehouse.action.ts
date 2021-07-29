import { createAction, props } from '@ngrx/store';
import { Warehouse } from '@minhdu-fontend/data-models';


export const addWarehouse = createAction(
  '[ADD_WAREHOUSE] Add Warehouse',
  props<{warehouse: any}>()
)
export const addWarehouseSuccess = createAction(
  '[ADD_WAREHOUSE] Add Warehouse Success',
  props<{warehouse: Warehouse}>()
)
export const LoadInit = createAction(
  '[LOAD_INIT] Load Warehouse'
)
export const LoadInitSuccess = createAction(
  '[LOAD_INIT] Load Warehouse Success',
  props<{warehouses: Warehouse[]}>()
)
export const getOneWarehouse = createAction(
  '[GET_WAREHOUSE] Get One Warehouse',
    props<{warehouseId: number}>()
)
export const getOneWarehouseSuccess = createAction(
  '[GET_WAREHOUSE] Get one Warehouse Success',
  props<{warehouse: Warehouse}>()
)

export const updateWarehouse = createAction(
  '[UPDATE_WAREHOUSE] Update Warehouse',
  props<{id: number,warehouse: any}>()
)
export const deleteWarehouse = createAction(
  '[DELETE_WAREHOUSE] Delete Warehouse',
  props<{id: number}>()
)
export const WarehouseAction = {
  addWarehouse,
  addWarehouseSuccess,
  LoadInit,
  LoadInitSuccess,
  getOneWarehouse,
  getOneWarehouseSuccess,
  updateWarehouse,
  deleteWarehouse
}
