import { createAction, props } from '@datorama/akita-ng-effects';
import { ProductDto, Warehouse } from '../warehouse/entities/product.entity';

const addProduct = createAction(
  '[WAREHOUSE/PRODUCT] Add Product',
  props<{ product: ProductDto }>()
);

const loadProduct = createAction(
  '[WAREHOUSE/PRODUCT] Load Products',
  props<{
    skip: number,
    take: number,
    warehouseId: number | null
  }>()
);

const selectWarehouse = createAction(
  '[WAREHOUSE] Selected Warehouse',
  props<{ warehouse: Warehouse }>()
);

export const ProductAction = {
  addProduct,
  loadProduct,
  selectWarehouse
};
