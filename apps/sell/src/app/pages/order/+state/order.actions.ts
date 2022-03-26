import { createAction, props } from '@datorama/akita-ng-effects';
import { OrderEntity } from '../enitities/order.entity';
import { AddOrderDto } from '../dto/add-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { LoadOrderDto } from '../dto/load-order.dto';

const addOne = createAction(
  '[ORDER] Add One',
  props<AddOrderDto>()
);

const loadAll = createAction(
  '[ORDER] Load Init',
  props<{param: LoadOrderDto, isPagination?: boolean}>()
);

const loadOne = createAction(
  '[ORDER] Load One',
  props<{ id: OrderEntity['id'] }>()
);

const update = createAction(
  '[ORDER] Update',
  props<{ id: OrderEntity['id'], updates: UpdateOrderDto , inRoute?: {routeId: number}}>()
);

const hide = createAction(
  '[ORDER] Hide',
  props<{ id: number, hide: any }>()
);

const payment = createAction(
  '[ORDER] Payment',
  props<{ order: any; id: number }>()
);

const remove = createAction(
  '[ORDER] Remove',
  props<{ id: number }>()
);


const cancelOrder = createAction(
  '[ORDER] Cancel',
  props<{ orderId: number }>()
);

export const OrderActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  hide,
  payment,
  remove,
  cancelOrder
};
