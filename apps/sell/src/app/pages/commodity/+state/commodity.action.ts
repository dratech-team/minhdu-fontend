import { createAction, props } from '@ngrx/store';
import { Commodity } from './commodity.interface';


export const addCommodity = createAction(
  '[ADD_COMMODITY] Add Commodity',
  props<{ commodity: any }>()
);
export const addCommoditySuccess = createAction(
  '[ADD_COMMODITY] Add Commodity Success',
  props<{ commodity: Commodity }>()
);

export const loadInit = createAction(
  '[LOAD_COMMODITY] Load Commodity',
  props<{ take: number, skip: number , orderId?: number}>()
);
export const loadInitSuccess = createAction(
  '[LOAD_COMMODITY] Load Commodity Success',
  props<{ commodity: Commodity[] }>()
);

export const loadMoreCommodity = createAction(
  '[LOAD_MORE_COMMODITY] Load Commodity',
  props<{ take: number, skip: number, orderId?: number }>()
);
export const loadMoreCommoditySuccess = createAction(
  '[LOAD_MORE_COMMODITY] Load More Commodity Success',
  props<{ commodity: Commodity[] }>()
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
  props<{ id: number, commodity: any }>()
);
export const deleteCommodity = createAction(
  '[DELETE_COMMODITY] Delete Commodity',
  props<{ id: number, orderId?: number }>()
);
export const CommodityAction = {
  addCommodity,
  addCommoditySuccess,
  loadInit,
  loadInitSuccess,
  loadMoreCommodity,
  loadMoreCommoditySuccess,
  getCommodity,
  getCommoditySuccess,
  updateCommodity,
  deleteCommodity
};
