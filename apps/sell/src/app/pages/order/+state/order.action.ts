import { createAction, props } from '@datorama/akita-ng-effects';
import { OrderDTO, UpdateOrderDto } from './order.interface';

const addOrder = createAction(
  '[ORDER] Add One',
  props<{ order: any }>()
);

const loadAll = createAction('[ORDERS] Load All');

const loadInit = createAction(
  '[ORDER] Load Init',
  props<{ orderDTO: Partial<OrderDTO> }>()
);

const loadMoreOrders = createAction(
  '[LOAD_MORE_ORDERS] Load More Order',
  props<{ orderDTO: Partial<OrderDTO> }>()
);

const getOrder = createAction(
  '[GET_ORDER] Get Order',
  props<{ id: number }>()
);

const updateOrder = createAction(
  '[UPDATE_ORDER] Update Order',
  props<{
    updateOrderDto: UpdateOrderDto
  }>()
);

const updateHideOrder = createAction(
  '[UPDATE_ORDER] Update Hide Order',
  props<{ hide: any; id: number; customerId: number }>()
);

const payment = createAction(
  '[PAYMENT] Payment',
  props<{ order: any; id: number }>()
);

const deleteOrder = createAction(
  '[DELETE_ORDER] Delete Order',
  props<{ id: number; customerId?: number }>()
);

const loadOrdersAssigned = createAction(
  '[LOAD_ORDERS_ASSIGNED] Load Order Assigned',
  props<{
    take: number;
    skip: number;
    paidType?: string;
    customer?: string;
    customerId?: number;
    status?: number;
  }>()
);

const loadMoreOrdersAssigned = createAction(
  '[LOAD_MORE_ORDERS_ASSIGNED] Load More Order Assigned',
  props<{
    take: number;
    skip: number;
    paidType?: string;
    customer?: string;
    customerId?: number;
    delivered?: number;
  }>()
);

const cancelOrder = createAction(
  '[CANCEL_ORDER] Cancel Order',
  props<{ orderId: number }>()
);

export const OrderAction = {
  addOrder,
  loadInit,
  loadAll,
  loadMoreOrders,
  getOrder,
  updateOrder,
  updateHideOrder,
  payment,
  deleteOrder,
  loadOrdersAssigned,
  loadMoreOrdersAssigned,
  cancelOrder
};
