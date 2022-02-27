import { createAction, props } from '@ngrx/store';
import { Commodity, CommodityDTO } from './commodity.interface';


export const addCommodity = createAction(
  '[ADD_COMMODITY] Add Commodity',
  props<{ commodity: any }>()
);
export const addCommoditySuccess = createAction(
  '[ADD_COMMODITY] Add Commodity Success',
  props<{ commodity: Commodity }>()
);

export const loadAllCommodities = createAction(
  '[LOAD_COMMODITY] load All Commodity'
);

export const loadInit = createAction(
  '[LOAD_COMMODITY] Load Commodity',
  props<{ CommodityDTO : CommodityDTO}>()
);
export const loadInitSuccess = createAction(
  '[LOAD_COMMODITY] Load Commodity Success',
  props<{ commodity: Commodity[], total: number }>()
);

export const loadMoreCommodity = createAction(
  '[LOAD_MORE_COMMODITY] Load Commodity',
  props<{ commodityDTO : CommodityDTO }>()
);
export const loadMoreCommoditySuccess = createAction(
  '[LOAD_MORE_COMMODITY] Load More Commodity Success',
  props<{ commodity: Commodity[], total: number }>()
);
export const getCommodity = createAction(
  '[GET_COMMODITY] Get Commodity ',
  props<{ id: number }>()
);
export const getCommoditySuccess = createAction(
  '[GET_COMMODITY] Get Commodity Success',
  props<{ commodity: Commodity }>()
);

export const updateCommodity = createAction(
  '[UPDATE_COMMODITY] Update Commodity',
  props<{ id: number, commodity: any, orderId?:number }>()
);

export const deleteCommodity = createAction(
  '[DELETE_COMMODITY] Delete Commodity',
  props<{ id: number, orderId?: number }>()
);

export const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity',
);
export const CommodityAction = {
  loadAllCommodities,
  addCommodity,
  addCommoditySuccess,
  loadInit,
  loadInitSuccess,
  loadMoreCommodity,
  loadMoreCommoditySuccess,
  getCommodity,
  getCommoditySuccess,
  updateCommodity,
  deleteCommodity,
  resetStateCommodityNewAdd
};
