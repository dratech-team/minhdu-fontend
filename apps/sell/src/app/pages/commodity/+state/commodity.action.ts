import {createAction, props} from '@ngrx/store';
import {AddCommodityDto} from "../dto/add-commodity.dto";
import {CommodityEntity} from "../entities/commodity.entity";
import {LoadCommodityDto} from "../dto/load-commodity.dto";
import {updateCommodityDto} from "../dto/update-commodity.dto";


export const addOne = createAction(
  '[COMMODITY] Add One',
  props<AddCommodityDto>()
);

export const loadAll = createAction(
  '[COMMODITY] Load All',
  props<{ params: LoadCommodityDto, isPagination?: boolean }>()
);

export const getOne = createAction(
  '[COMMODITY] Get One ',
  props<{ id: CommodityEntity['id'] }>()
);

export const update = createAction(
  '[COMMODITY] Update',
  props<{ id: number, updates: updateCommodityDto}>()
);

export const remove = createAction(
  '[COMMODITY] Remove',
  props<{ id: number, inOrder?: { orderId: number } }>()
);

export const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity',
);
export const CommodityAction = {addOne, loadAll, getOne, update, remove, resetStateCommodityNewAdd};
