import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Warehouse } from '@minhdu-fontend/data-models';
import { WarehouseAction } from './warehouse.action';

export interface WarehouseState extends EntityState<Warehouse>{
  loaded: boolean,
  selectedWarehouseId: number,
}
export const adapter: EntityAdapter<Warehouse> = createEntityAdapter<Warehouse>();
export const initialWarehouse = adapter.getInitialState({loaded: false});
export const WarehouseReducer = createReducer(
  initialWarehouse,
  on(WarehouseAction.LoadInitSuccess, (state,action)=>
    adapter.setAll(action.warehouses, {...state, loaded: true})
  ),
  on(WarehouseAction.updateWarehouse, (state,action)=>
    adapter.upsertOne(action.warehouse, {...state, loaded: true})
  )
)
export const {selectAll, selectEntities} = adapter.getSelectors()
