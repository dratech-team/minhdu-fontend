import { createAction, props } from '@datorama/akita-ng-effects';
import { AddProductDto, SearchProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities';

const addOne = createAction(
  '[PRODUCT] Add One',
  props<{ product: AddProductDto }>()
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
  props<UpdateProductDto>()
);

const remove = createAction(
  '[PRODUCT] Delete',
  props<{ id: Product['id'] }>()
);

export const ProductActions = { addOne, loadAll, getOne, update, remove };
