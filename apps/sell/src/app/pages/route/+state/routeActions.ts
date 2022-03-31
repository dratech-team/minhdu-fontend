import {AddRouteDto} from '../dto/add-route.dto';
import {createAction, props} from '@datorama/akita-ng-effects';
import {UpdateRouteDto} from '../dto/update-route.dto';
import {SearchRouteDto} from '../dto/search-route.dto';
import {CancelDto} from "../dto/cancel-commodity.dto";

const addOne = createAction(
  '[ROUTE] Add One',
  props<AddRouteDto>()
);

const loadAll = createAction(
  '[ROUTE] Load All',
  props<{ params: SearchRouteDto, isPagination?: boolean }>()
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

const cancel = createAction(
  '[ROUTE] Cancel',
  props<{ id: number, cancelDTO: CancelDto }>()
);

const error = createAction(
  '[ROUTE] Error',
  props<{ error: string }>()
)

export const RouteActions = {addOne, loadAll, loadOne, update, remove, cancel, error};
