import { createAction, props } from '@datorama/akita-ng-effects';
import { AddStockDto, SearchStockDto, UpdateStockDto } from '../dto';
import { StockEntity } from '../entities';

const addOne = createAction('[STOCK] Add One', props<AddStockDto>());

const loadAll = createAction('[STOCK] Load All', props<SearchStockDto>());

const getOne = createAction(
  '[STOCK] Get One',
  props<{ id: StockEntity['id'] }>()
);

const update = createAction('[STOCK] Update', props<UpdateStockDto>());

const remove = createAction(
  '[STOCK] Delete',
  props<{ id: StockEntity['id'] }>()
);

const error = createAction('[STOCK] Error', props<{ error: string }>());

export const StockActions = { addOne, loadAll, getOne, update, remove, error };
