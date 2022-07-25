import { createAction, props } from '@datorama/akita-ng-effects';
import { AddCustomerDto, LoadOneCustomerDto, RemoveCustomerDto, UpdateCustomerDto } from '../dto';
import { SearchOrderDto } from '../../order/dto';
import { ResponsePaginateOrderEntity } from '../../order/enitities/response-paginate-order.entity';
import { CustomerEntity } from '../entities';

const addOne = createAction('[CUSTOMER] Add One', props<AddCustomerDto>());

const loadAll = createAction('[CUSTOMER] Load All', props<SearchOrderDto>());

const loadOne = createAction('CUSTOMER] Load One', props<LoadOneCustomerDto>());

const update = createAction('[CUSTOMER] Update', props<UpdateCustomerDto>());

const remove = createAction('[CUSTOMER] Remove', props<RemoveCustomerDto>());

const loadOrder = createAction(
  '[CUSTOMER] Load Order Delivering/Delivered',
  props<SearchOrderDto & { typeOrder: 'delivered' | 'delivering' }>()
);

const loadOrderSuccess = createAction(
  '[CUSTOMER] Load Order Delivering/Delivered Success',
  props<ResponsePaginateOrderEntity & { customer: CustomerEntity } & { typeOrder: 'delivered' | 'delivering' }>()
);

const error = createAction('[CUSTOMER] error', props<{ error: string }>());

export const CustomerActions = {
  addOne,
  loadOne,
  loadAll,
  update,
  remove,
  loadOrder,
  loadOrderSuccess,
  error
};
