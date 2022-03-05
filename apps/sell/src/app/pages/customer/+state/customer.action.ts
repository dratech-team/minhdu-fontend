import { createAction, props } from '@datorama/akita-ng-effects';
import { CustomerType, Gender } from '@minhdu-fontend/enums';
import { Customer } from './customer.interface';

const addOne = createAction(
  '[CUSTOMER] Add One',
  props<{ customer: any }>()
);

const loadAll = createAction(
  '[CUSTOMER] Load All',
  props<{
    skip: number,
    take: number,
    type?: string,
    resource?: string,
    isPotential?: number,
    phone?: number,
    nationId?: number,
    gender?: Gender,
    birthDay?: Date,
    email?: string,
    note?: string,
    customerType?: CustomerType,
    customer?: string,

  }>()
);

const loadOne = createAction(
  '[GET_CUSTOMER] Get Customer ',
  props<{ id: number }>()
);

const update = createAction(
  '[CUSTOMER] Update',
  props<{ customer: any, id: number }>()
);


const remove = createAction(
  '[CUSTOMER] Remove',
  props<{ id: number, customerId?: number }>()
);

const loadOrderDelivered = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: Customer['id'] }>()
);

const loadOrderDelivering = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: Customer['id'] }>()
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

