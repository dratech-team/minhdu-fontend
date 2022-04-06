import { createAction, props } from '@datorama/akita-ng-effects';
import {AddStockDto, SearchStockDto, UpdateStockDto} from '../dto';
import { stockEntity } from '../entities';

const addOne = createAction(
  '[PRODUCT] Add One',
  props<AddStockDto>()
);

const loadAll = createAction(
  '[PRODUCT] Load All',
  props<{ params: SearchStockDto, isPagination?: boolean }>()
);

const getOne = createAction(
  '[PRODUCT] Get One',
  props<{ id: stockEntity['id'] }>()
);

const update = createAction(
  '[PRODUCT] Update',
  props<UpdateStockDto>()
);

const remove = createAction(
  '[PRODUCT] Delete',
  props<{ id: stockEntity['id'] }>()
);

export const StockActions = { addOne, loadAll, getOne, update, remove };
