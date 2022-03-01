import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateCommodityDto } from '../dto/create-commodity.dto';
import { SearchCommodityDto } from '../dto/search-commodity.dto';
import { UpdateCommodityDto } from '../dto/update-commodity.dto';

const addOne = createAction(
  '[COMMODITY] Add One',
  props<CreateCommodityDto>()
);

const loadAll = createAction(
  '[COMMODITY] load All',
  props<SearchCommodityDto>()
);

const getOne = createAction(
  '[COMMODITY] Get One ',
  props<{ id: number }>()
);

const update = createAction(
  '[COMMODITY] Update',
  props<{ id: number, updates: UpdateCommodityDto }>()
);

const remove = createAction(
  '[COMMODITY] Remove',
  props<{ id: number }>()
);

export const CommodityActions = { loadAll, addOne, getOne, update, remove };
