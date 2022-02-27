import { createAction, props } from '@datorama/akita-ng-effects';
import { Commodity, CommodityDTO } from '../entities/commodity.entity';

const addCommodity = createAction(
  '[ADD_COMMODITY] Add Commodity',
  props<{ commodity: any }>()
);

const addCommoditySuccess = createAction(
  '[ADD_COMMODITY] Add Commodity Success',
  props<{ commodity: Commodity }>()
);

const loadAllCommodities = createAction(
  '[LOAD_COMMODITY] load All Commodity'
);

const loadInit = createAction(
  '[LOAD_COMMODITY] Load Commodity',
  props<{ CommodityDTO: CommodityDTO }>()
);

const loadInitSuccess = createAction(
  '[LOAD_COMMODITY] Load Commodity Success',
  props<{ commodity: Commodity[], total: number }>()
);

const loadMoreCommodity = createAction(
  '[LOAD_MORE_COMMODITY] Load Commodity',
  props<{ commodityDTO: CommodityDTO }>()
);

const loadMoreCommoditySuccess = createAction(
  '[LOAD_MORE_COMMODITY] Load More Commodity Success',
  props<{ commodity: Commodity[], total: number }>()
);

const getCommodity = createAction(
  '[GET_COMMODITY] Get Commodity ',
  props<{ id: number }>()
);

const getCommoditySuccess = createAction(
  '[GET_COMMODITY] Get Commodity Success',
  props<{ commodity: Commodity }>()
);

const updateCommodity = createAction(
  '[UPDATE_COMMODITY] Update Commodity',
  props<{ id: number, commodity: any, orderId?: number }>()
);

const deleteCommodity = createAction(
  '[DELETE_COMMODITY] Delete Commodity',
  props<{ id: number, orderId?: number }>()
);

const resetStateCommodityNewAdd = createAction(
  '[UPDATE_STATE_COMMODITY] Reset State Commodity'
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
