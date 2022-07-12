import { createAction, props } from '@datorama/akita-ng-effects';
import { AddProductDto, SearchProductDto, UpdateProductDto } from '../dto';
import { ProductEntity } from '../entities';

const addOne = createAction('[STOCK] Add One', props<AddProductDto>());

const loadAll = createAction('[STOCK] Load All', props<SearchProductDto>());

const getOne = createAction(
  '[STOCK] Get One',
  props<{ id: ProductEntity['id'] }>()
);

const update = createAction('[STOCK] Update', props<UpdateProductDto>());

const remove = createAction(
  '[STOCK] Delete',
  props<{ id: ProductEntity['id'] }>()
);

const error = createAction('[STOCK] Error', props<{ error: string }>());

export const ProductActions = {
  addOne,
  loadAll,
  getOne,
  update,
  remove,
  error,
};
