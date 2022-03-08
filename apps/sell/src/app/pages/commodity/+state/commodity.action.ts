import {createAction, props} from '@ngrx/store';
import {AddCommodityDto} from "../dto/add-commodity.dto";
import {CommodityEntity} from "../entities/commodity.entity";
import {CommodityDTO} from "../dto/commodity.dto";
import {updateCommodityDto} from "../dto/update-commodity.dto";


export const addOne = createAction(
  '[COMMODITY] Add One',
  props<AddCommodityDto>()
);

export const loadAll = createAction(
  '[COMMODITY] Load All',
  props<CommodityDTO>()
);

export const getOne = createAction(
  '[COMMODITY] Get One ',
  props<{ id: CommodityEntity['id'] }>()
);

export const update = createAction(
  '[COMMODITY] Update',
  props<{ id: number, updateCommodityDto: updateCommodityDto }>()
);

export const remove = createAction(
  '[COMMODITY] Remove',
  props<{ id: number, orderId?: number }>()
);

export const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity',
);
export const CommodityAction = {addOne, loadAll, getOne, update, remove, resetStateCommodityNewAdd};
