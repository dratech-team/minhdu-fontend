import { createAction, props } from '@datorama/akita-ng-effects';
import { AddOrderDto, LoadOneOrderDto, RemoveOrderDto, SearchOrderDto, UpdateOrderDto } from '../dto';

const addOne = createAction('[ORDER] Add One', props<AddOrderDto>());

const loadAll = createAction(
  '[ORDER] Load Init',
  props<SearchOrderDto>()
);

const loadOne = createAction('[ORDER] Load One', props<LoadOneOrderDto>());

const update = createAction('[ORDER] Update', props<UpdateOrderDto>());

const hide = createAction('[ORDER] Hide', props<{ id: number; hide: any }>());

const payment = createAction(
  '[ORDER] Payment',
  props<{ order: any; id: number }>()
);

const remove = createAction('[ORDER] Remove', props<RemoveOrderDto>());

const cancel = createAction(
  '[ORDER] Cancel',
  props<{ orderId: number }>()
);

const restore = createAction(
  '[ORDER] Restore',
  props<{ id: number }>()
);

const error = createAction('[ORDER] Error', props<{ error: string }>());

const historyOrder = createAction(
  '[ORDER] History Order',
  props<{ id: number }>()
);

export const OrderActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  hide,
  payment,
  remove,
  cancel,
  restore,
  error,
  historyOrder
};
