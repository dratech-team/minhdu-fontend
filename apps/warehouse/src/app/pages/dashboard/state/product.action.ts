import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateProductDto } from '../dto/create-product.dto';
import { SearchProductDto } from '../dto/search-product.dto';

const addProduct = createAction(
  '[WAREHOUSE/PRODUCT] Add Product',
  props<{ product: CreateProductDto }>()
);

const loadProduct = createAction(
  '[WAREHOUSE/PRODUCT] Load Products',
  props<{
    search: Partial<SearchProductDto>
  }>()
);

export const ProductAction = {
  addProduct,
  loadProduct
};
