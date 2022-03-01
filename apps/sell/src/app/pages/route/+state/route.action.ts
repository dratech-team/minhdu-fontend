import {createAction, props} from '@datorama/akita-ng-effects';
import {Route} from "./entities/route.entity";


export const addOne = createAction(
  '[ROUTE] Add One',
  props<{ routeDto: Partial<Route> }>()
);

export const loadAll = createAction(
  '[ROUTE] Load All',
  props<{

  }>()
);

export const getOne = createAction(
  '[ROUTE] Get One',
  props<{ id: number }>()
);

export const update = createAction(
  '[ROUTE] Update',
  props<{ id: number; route: Omit<Partial<Route>, 'id'> }>()
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
