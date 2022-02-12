import { createAction, props } from '@datorama/akita-ng-effects';
import { ProductDto } from '../entities/product-dto.entity';

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

export const ProductAction = {
  addProduct,
  loadProduct
};
