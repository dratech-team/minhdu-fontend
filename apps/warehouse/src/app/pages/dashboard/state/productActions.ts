import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateProductDto } from '../dto/create-product.dto';
import { LoadProductDto } from '../dto/load-product.dto';

const addOne = createAction(
  '[WAREHOUSE/PRODUCT] Add One',
  props<{ product: CreateProductDto }>()
);

const loadAll = createAction(
  '[WAREHOUSE/PRODUCT] Load All',
  props<LoadProductDto>()
);

const update = createAction(
  '[WAREHOUSE/PRODUCT] Update',
  props<{id: number}>()
);

export const ProductActions = { addOne, loadAll};
