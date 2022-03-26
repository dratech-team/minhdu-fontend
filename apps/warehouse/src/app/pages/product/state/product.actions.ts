import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateProductDto, SearchProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities';

const addOne = createAction(
  '[PRODUCT] Add One',
  props<{ product: CreateProductDto }>()
);

const loadAll = createAction(
  '[PRODUCT] Load All',
  props<{ params: SearchProductDto, isPagination?: boolean }>()
);

const getOne = createAction(
  '[PRODUCT] Get One',
  props<{ id: Product['id'] }>()
);

const update = createAction(
  '[PRODUCT] Update',
  props<{ id: Product['id'], body: UpdateProductDto }>()
);

const remove = createAction(
  '[PRODUCT] Delete',
  props<{ id: Product['id'] }>()
);

export const ProductActions = { addOne, loadAll, getOne, update, remove };
