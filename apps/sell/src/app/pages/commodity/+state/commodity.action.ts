import { createAction, props } from '@datorama/akita-ng-effects';
import { Commodity, CommodityDTO } from '../entities/commodity.entity';

const addCommodity = createAction(
  '[ADD_COMMODITY] Add Commodity',
  props<{ commodity: any }>()
);

const loadAllCommodities = createAction(
  '[LOAD_COMMODITY] load All Commodity'
);

const loadInit = createAction(
  '[LOAD_COMMODITY] Load Commodity',
  props<{ CommodityDTO: CommodityDTO }>()
);

const loadMoreCommodity = createAction(
  '[LOAD_MORE_COMMODITY] Load Commodity',
  props<{ commodityDTO: CommodityDTO }>()
);

const getCommodity = createAction(
  '[GET_COMMODITY] Get Commodity ',
  props<{ id: number }>()
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
  loadInit,
  loadMoreCommodity,
  getCommodity,
  updateCommodity,
  deleteCommodity,
  resetStateCommodityNewAdd
};
