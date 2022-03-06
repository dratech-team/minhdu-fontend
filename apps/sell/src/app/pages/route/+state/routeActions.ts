import { AddRouteDto } from '../dto/add-route.dto';
import { createAction, props } from '@datorama/akita-ng-effects';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { LoadRouteDto } from '../dto/load-route.dto';

const addOne = createAction(
  '[ROUTE] Add One',
  props<AddRouteDto>()
);

const loadAll = createAction(
  '[ROUTE] Load All',
  props<LoadRouteDto>()
);

const loadOne = createAction(
  '[ROUTE] Load One',
  props<{ id: number }>()
);

const update = createAction(
  '[ROUTE] Update',
  props<{ id: number; updates: Partial<UpdateRouteDto> }>()
);

const remove = createAction(
  '[ROUTE] Remove',
  props<{ idRoute: number }>()
);

export const RouteActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove
};
