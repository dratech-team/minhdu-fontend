import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from './entities/product.entity';
import { createReducer, on } from '@ngrx/store';
import { WarehouseAction } from './warehouse.action';

export interface WarehouseState extends EntityState<Product> {
  loading: boolean;
  warehouseId: number;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initial = adapter.getInitialState({ loading: true });

export const warehouseReducer = createReducer(
  initial,
  on(WarehouseAction.loadProductSuccess, (state, action) => {
      return adapter.addMany(action.products, { ...state, loading: false });
    }
  ),
  on(WarehouseAction.addProduct, (state, action) =>
    adapter.addOne(action.product, { ...state, loading: true })
  ),
  on(WarehouseAction.addProductSuccess, (state, action) =>
    adapter.addOne(action.product, { ...state, loading: false })
  ),
  on(WarehouseAction.selectWarehouse, (state, action) => {
    console.log("reducer", action)
    return { ...state, warehouseId: action.warehouseId };
  })
);

export const {
  selectAll
} = adapter.getSelectors();
