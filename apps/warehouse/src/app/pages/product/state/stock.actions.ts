import { createAction, props } from '@datorama/akita-ng-effects';
import {AddStockDto, SearchStockDto, UpdateStockDto} from '../dto';
import { ProductEntity } from '../entities';

const addOne = createAction(
  '[STOCK] Add One',
  props<AddStockDto>()
);

const loadAll = createAction(
  '[STOCK] Load All',
  props<{ params: SearchStockDto, isPagination?: boolean }>()
);

const getOne = createAction(
  '[STOCK] Get One',
  props<{ id: ProductEntity['id'] }>()
);

const update = createAction(
  '[STOCK] Update',
  props<UpdateStockDto>()
);

const remove = createAction(
  '[STOCK] Delete',
  props<{ id: ProductEntity['id'] }>()
);

export const StockActions = { addOne, loadAll, getOne, update, remove };
