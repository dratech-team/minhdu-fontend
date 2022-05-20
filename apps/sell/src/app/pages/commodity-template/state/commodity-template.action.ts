import {createAction, props} from '@datorama/akita-ng-effects';
import {AddCommodityTemplateDto} from "../dto/add-commodity-template.dto";
import {SearchCommodityTemplateDto} from "../dto/search-commodity-template.dto";
import {UpdateCommodityTemplateDto} from "../dto/update-commodity-template.dto";
import {RemoveCommodityDto} from "../dto/remove-commodity-template.dto";
import {LoadOneCommodityTemplateDto} from "../dto/load-one-commodity-template.dto";

const addOne = createAction(
  '[COMMODITY_TEMPLATE] Add One',
  props<AddCommodityTemplateDto>()
);

const loadAll = createAction(
  '[COMMODITY_TEMPLATE] Load All',
  props<SearchCommodityTemplateDto>()
);

const loadOne = createAction(
  '[COMMODITY_TEMPLATE] Load One',
  props<LoadOneCommodityTemplateDto>()
);

const update = createAction(
  '[COMMODITY_TEMPLATE] Update',
  props<UpdateCommodityTemplateDto>()
);

const remove = createAction(
  '[COMMODITY_TEMPLATE] Remove',
  props<RemoveCommodityDto>()
);

const error = createAction(
  '[COMMODITY_TEMPLATE] Error',
  props<{ error: string }>()
);


export const CommodityTemplateActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
