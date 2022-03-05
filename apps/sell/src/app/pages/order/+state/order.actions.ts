import { createAction, props } from '@datorama/akita-ng-effects';
import { OrderDTO, UpdateOrderDto } from '../enitities/order.interface';

const addOne = createAction(
  '[ORDER] Add One',
  props<{ order: any }>()
);

const loadAll = createAction(
  '[ORDER] Load Init',
  props<{ orderDTO: Partial<OrderDTO> }>()
);

const loadOne = createAction(
  '[ORDER] Load One',
  props<{ id: number }>()
);

const update = createAction(
  '[ORDER] Update',
  props<{
    updateOrderDto: UpdateOrderDto
  }>()
);

const hide = createAction(
  '[ORDER] Hide',
  props<{ hide: any; id: number; customerId: number }>()
);

const payment = createAction(
  '[ORDER] Payment',
  props<{ order: any; id: number }>()
);

const remove = createAction(
  '[ORDER] Remove',
  props<{ id: number; customerId?: number }>()
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
