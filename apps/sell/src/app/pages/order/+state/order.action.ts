import { createAction, props } from '@ngrx/store';
import { Order } from './order.interface';

export const addOrder = createAction(
  '[ADD_ORDER] Add Order',
  props<{ order: any }>()
);

export const addOrderSuccess = createAction(
  '[ADD_ORDER] Add Order Success',
  props<{ order: Order }>()
);

export const loadInit = createAction(
  '[LOAD_ORDERS] Load Order',
  props<{ take: number,
    skip: number,
    paidType?: string,
    name?: string,
    customerId?: number,
    routeId?: number }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_ORDERS_SUCCESS] Load Order Success',
  props<{ orders: Order[] }>()
);

export const loadMoreOrders = createAction(
  '[LOAD_MORE_ORDERS] Load More Order',
  props<{ take: number, skip: number,paidType?: string, customerId?:number, routeId?: number }>()
);

export const loadMoreOrdersSuccess = createAction(
  '[LOAD_MORE_ORDERS] Load More Order success',
  props<{ orders: Order[] }>()
);

export const getOrder = createAction(
  '[GET_ORDER] Get Order',
  props<{ id: number }>()
);

export const getOrderSuccess = createAction(
  '[GET_ORDER] Get Order Success',
  props<{ order: Order }>()
);

export const updateOrder = createAction(
  '[UPDATE_ORDER] Update Order',
  props<{ order: any, id: number }>()
);

export const payment = createAction(
  '[PAYMENT] Payment',
  props<{ order: any, id: number }>()
);

export const deleteOrder = createAction(
  '[DELETE_ORDER] Delete Order',
  props<{ id: number }>()
);

export const OrderAction = {
  addOrder,
  addOrderSuccess,
  loadInit,
  loadInitSuccess,
  loadMoreOrders,
  loadMoreOrdersSuccess,
  getOrder,
  getOrderSuccess,
  updateOrder,
  payment,
  deleteOrder
};
