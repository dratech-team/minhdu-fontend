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

export  const loadAllOrder = createAction(
  '[LOAD_ORDERS] Load All Order'
)

export const loadInit = createAction(
  '[LOAD_ORDERS] Load Order',
  props<{
    take: number;
    skip: number;
    paidType?: string;
    customerId?: number;
    routeId?: number;
    customer?: string;
    delivered?: number;
    explain?: string;
    createdAt?: Date;
    destination?: string
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_ORDERS_SUCCESS] Load Order Success',
  props<{ orders: Order[] }>()
);

export const loadMoreOrders = createAction(
  '[LOAD_MORE_ORDERS] Load More Order',
  props<{
    take: number;
    skip: number;
    paidType?: string;
    customerId?: number;
    routeId?: number;
    customer?: string;
    delivered?: number;
    explain?: string;
    createdAt?: Date;
    destination?: string
  }>()
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
  props<{ order: any; id: number; typeUpdate?: string }>()
);

export const payment = createAction(
  '[PAYMENT] Payment',
  props<{ order: any; id: number }>()
);

export const deleteOrder = createAction(
  '[DELETE_ORDER] Delete Order',
  props<{ id: number, customerId?: number }>()
);
export const loadOrdersAssigned = createAction(
  '[LOAD_ORDERS_ASSIGNED] Load Order Assigned',
  props<{
    take: number;
    skip: number;
    paidType?: string;
    customer?: string;
    customerId?: number;
    delivered?: number;
  }>()
);

export const loadOrdersAssignedSuccess = createAction(
  '[LOAD_ORDERS_ASSIGNED] Load Order Assigned Success',
  props<{ orders: Order[] }>()
);
export const loadMoreOrdersAssigned = createAction(
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
export const loadMoreOrdersAssignedSuccess = createAction(
  '[LOAD__MORE_ORDERS_ASSIGNED] Load More Order Assigned Success',
  props<{ orders: Order[] }>()
);

export const OrderAction = {
  addOrder,
  addOrderSuccess,
  loadInit,
  loadAllOrder,
  loadInitSuccess,
  loadMoreOrders,
  loadMoreOrdersSuccess,
  getOrder,
  getOrderSuccess,
  updateOrder,
  payment,
  deleteOrder,
  loadOrdersAssigned,
  loadOrdersAssignedSuccess,
  loadMoreOrdersAssigned,
  loadMoreOrdersAssignedSuccess,
};
