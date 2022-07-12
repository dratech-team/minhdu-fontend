import { AddRouteDto, CancelDto, SearchRouteDto, UpdateRouteDto } from '../dto';
import { createAction, props } from '@datorama/akita-ng-effects';

const addOne = createAction('[ROUTE] Add One', props<AddRouteDto>());

const loadAll = createAction(
  '[ROUTE] Load All',
  props<SearchRouteDto>()
);

const loadOne = createAction('[ROUTE] Load One', props<{ id: number }>());

const update = createAction('[ROUTE] Update', props<UpdateRouteDto>());

const remove = createAction('[ROUTE] Remove', props<{ idRoute: number }>());

const cancel = createAction(
  '[ROUTE] Cancel',
  props<{ id: number; cancelDTO: CancelDto }>()
);

const error = createAction('[ROUTE] Error', props<{ error: string }>());

export const RouteActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  cancel,
  error
};
