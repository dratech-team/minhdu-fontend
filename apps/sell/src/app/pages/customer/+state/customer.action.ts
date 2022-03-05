import { createAction, props } from '@datorama/akita-ng-effects';
import { CustomerEntity } from '../entities/customer.interface';
import { AddCustomerDto } from '../dto/add-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { LoadCustomerDto } from '../dto/load-customer.dto';

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<AddCustomerDto>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<LoadCustomerDto>()
);

const loadOne = createAction(
  '[GET_CUSTOMER] Get Customer ',
  props<{ id: number }>()
);

const update = createAction(
  '[CUSTOMER] Update',
  props<{ id: number, updates: UpdateCustomerDto }>()
);

const remove = createAction(
  '[CUSTOMER] Remove',
  props<{ id: number, customerId?: number }>()
);

const loadOrderDelivered = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: CustomerEntity['id'] }>()
);

const loadOrderDelivering = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: CustomerEntity['id'] }>()
);

export const CustomerAction = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  loadOrderDelivered,
  loadOrderDelivering
};

