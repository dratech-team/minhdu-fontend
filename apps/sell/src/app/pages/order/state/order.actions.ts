import { createAction, props } from '@datorama/akita-ng-effects';
import { AddOrderDto, LoadOneOrderDto, RemoveOrderDto, SearchOrderDto, UpdateOrderDto } from '../dto';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import { ResponsePaginateOrderEntity } from '../enitities/response-paginate-order.entity';

const addOne = createAction('[ORDER] Add One', props<AddOrderDto>());

const loadAll = createAction(
  '[ORDER] Load All',
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
  props<{ id: number, reason?: string }>()
);

const restore = createAction(
  '[ORDER] Restore',
  props<{ id: number }>()
);

const error = createAction('[ORDER] Error', props<{ error: string }>());

const orderHistory = createAction(
  '[ORDER] History Order',
  props<{ orderId: number, loadMore?: boolean }>()
);

const addOneSuccess = createAction(
  '[ORDER] Add One Successfully',
  props<BaseOrderEntity>()
);

const loadAllSuccess = createAction(
  '[ORDER] Load All Successfully',
  props<ResponsePaginateOrderEntity>()
);

const removeOneSuccess = createAction(
  '[ORDER] Remove One Successfully',
  props<OrderEntity>()
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
  orderHistory,
  addOneSuccess,
  loadAllSuccess,
  removeOneSuccess
};
