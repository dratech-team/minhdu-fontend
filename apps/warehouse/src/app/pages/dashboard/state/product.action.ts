import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateProductDto } from '../dto/create-product.dto';
import { LoadProductDto } from '../dto/load-product.dto';

const addProduct = createAction(
  '[WAREHOUSE/PRODUCT] Add Product',
  props<{ product: CreateProductDto }>()
);

const loadAll = createAction(
  '[WAREHOUSE/PRODUCT] Load Products',
  props<LoadProductDto>()
);

export const ProductAction = {
  addProduct,
  loadProduct: loadAll
};
