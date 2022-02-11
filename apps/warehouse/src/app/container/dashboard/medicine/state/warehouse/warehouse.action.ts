import { createAction, props } from '@ngrx/store';
import { Product, ProductDto } from './entities/product.entity';

const addProduct = createAction(
  '[WAREHOUSE] Add Product',
  props<{ product: ProductDto }>()
);

const addProductSuccess = createAction(
  '[WAREHOUSE] Add Product Success!!',
  props<{ product: Product }>()
);

const loadProduct = createAction(
  '[WAREHOUSE] Load Products',
  props<{
    skip: number,
    take: number,
    warehouseId: number
  }>()
);

const loadProductSuccess = createAction(
  '[WAREHOUSE] Load Products Success!!',
  props<{ products: Product[] }>()
);

const selectWarehouse = createAction(
  '[WAREHOUSE] Select Warehouse Id',
  props<{ warehouseId: number }>()
);

export const WarehouseAction = {
  addProduct,
  loadProduct,
  addProductSuccess,
  loadProductSuccess,
  selectWarehouse,
};
