import {createAction, props} from '@datorama/akita-ng-effects';
import {Route} from "../entities/route.entity";
import {SearchRouteDto} from "../entities/search-route-dto.entity";
import {UpdateRouteDto} from "../entities/update-route-dto.entity";
import {CreateRouteDto} from "../entities/create-route-dto.entity";


export const addOne = createAction(
  '[ROUTE] Add One',
  props<CreateRouteDto>()
);

export const loadAll = createAction(
  '[ROUTE] Load All',
  props<SearchRouteDto>()
);

export const getOne = createAction(
  '[ROUTE] Get One',
  props<{ id: number }>()
);

export const update = createAction(
  '[ROUTE] Update',
  props<{ id: number; updates: UpdateRouteDto }>()
);

export const remove = createAction(
  '[ROUTE] Remove',
  props<{ id: number }>()
);

export const RouteActions = {
  addOne,
  loadAll,
  getOne,
  update,
  remove
};
