import { createAction, props } from '@ngrx/store';
import { AddCommodityDto, SearchCommodityDto, UpdateCommodityDto } from '../dto';
import { CommodityEntity } from '../entities';

const addOne = createAction(
  '[COMMODITY] Add One',
  props<AddCommodityDto>()
);

const loadAll = createAction(
  '[COMMODITY] Load All',
  props<SearchCommodityDto>()
);

const getOne = createAction(
  '[COMMODITY] Get One ',
  props<{ id: CommodityEntity['id'] }>()
);

const update = createAction(
  '[COMMODITY] Update',
  props<UpdateCommodityDto>()
);

const remove = createAction(
  '[COMMODITY] Remove',
  props<{ id: number; inOrder?: { orderId: number } }>()
);

const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity'
);

const error = createAction(
  '[COMMODITY] Error',
  props<{ error: string }>()
);
export const CommodityAction = {
  addOne,
  loadAll,
  getOne,
  update,
  remove,
  resetStateCommodityNewAdd,
  error
};
