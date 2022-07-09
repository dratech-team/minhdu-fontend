import { createAction, props } from '@datorama/akita-ng-effects';
import { BaseOrderEntity } from '../enitities';
import {
  AddOrderDto,
  BaseAddOrderDto,
  LoadOneOrderDto,
  RemoveOrderDto,
  BaseSearchOrderDto,
  UpdateOrderDto,
} from '../dto';
import { OrderEntity } from '../enitities/order.entity';

const addOne = createAction('[ORDER] Add One', props<AddOrderDto>());

const loadAll = createAction(
  '[ORDER] Load Init',
  props<{ param: BaseSearchOrderDto; isPagination?: boolean }>()
);

const loadOne = createAction('[ORDER] Load One', props<LoadOneOrderDto>());

const update = createAction('[ORDER] Update', props<UpdateOrderDto>());

const hide = createAction('[ORDER] Hide', props<{ id: number; hide: any }>());

const payment = createAction(
  '[ORDER] Payment',
  props<{ order: any; id: number }>()
);

const remove = createAction('[ORDER] Remove', props<RemoveOrderDto>());

const cancelOrder = createAction(
  '[ORDER] Cancel',
  props<{ orderId: number }>()
);

const error = createAction('[ORDER] Error', props<{ error: string }>());

export const OrderActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  hide,
  payment,
  remove,
  cancelOrder,
  error,
};
