import { createAction, props } from '@ngrx/store';
import { AddCommodityDto, SearchCommodityDto, UpdateCommodityDto } from '../dto';
import { CommodityEntity } from '../entities';

export const addOne = createAction(
  '[COMMODITY] Add One',
  props<AddCommodityDto>()
);

export const loadAll = createAction(
  '[COMMODITY] Load All',
  props<SearchCommodityDto>()
);

export const getOne = createAction(
  '[COMMODITY] Get One ',
  props<{ id: CommodityEntity['id'] }>()
);

export const update = createAction(
  '[COMMODITY] Update',
  props<UpdateCommodityDto>()
);

export const remove = createAction(
  '[COMMODITY] Remove',
  props<{ id: number, inOrder?: { orderId: number } }>()
);

export const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity'
);
export const CommodityAction = { addOne, loadAll, getOne, update, remove, resetStateCommodityNewAdd };
