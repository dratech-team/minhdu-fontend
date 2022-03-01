import { createAction, props } from '@datorama/akita-ng-effects';
import { CreateOrderDto } from '../dto/create-order.dto';
import { SearchOrderDto } from '../dto/search-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

const addOne = createAction(
  '[ORDER] Add Order',
  props<CreateOrderDto>()
);

const loadAll = createAction(
  '[ORDER] Load More Order',
  props<Partial<SearchOrderDto> & {
    take: number;
    skip: number
  }>()
);

const getOne = createAction(
  '[ORDER] Get One Order',
  props<{ id: number }>()
);

const update = createAction(
  '[ORDER] Update Order',
  props<UpdateOrderDto>()
);

const hide = createAction(
  '[UPDATE_ORDER] Update Hide Order',
  props<{ id: number; hide: any }>()
);

const payment = createAction(
  '[PAYMENT] Payment',
  props<{ order: any; id: number }>()
);

const remove = createAction(
  '[ORDER] Delete Order',
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

const cancelOrder = createAction(
  '[CANCEL_ORDER] Cancel Order',
  props<{ orderId: number }>()
);

const handleOrderError = createAction('[ORDER_ERROR] Order error');

export const OrderAction = {
  addOne,
  loadAll,
  getOne,
  update,
  hide,
  remove,
  payment,
  loadOrdersAssigned,
  cancelOrder,
  handleOrderError
};
