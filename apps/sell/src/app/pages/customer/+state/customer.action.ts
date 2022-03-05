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

const loadMoreCustomers = createAction(
  '[LOAD_MORE_CUSTOMER] Load More Customer',
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

const getCustomer = createAction(
  '[GET_CUSTOMER] Get Customer ',
  props<{ id: number }>()
);

const updateCustomer = createAction(
  '[UPDATE_CUSTOMER] Update Customer',
  props<{ customer: any, id: number }>()
);


const deleteCustomer = createAction(
  '[DELETE_CUSTOMER] Delete Customer',
  props<{ id: number, customerId?: number }>()
);

const loadOrderDelivered = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: Customer['id']}>()
);

const loadOrderDelivering = createAction(
  `[CUSTOMER] Load Order Delivered`,
  props<{ customerId: Customer['id']}>()
);

export const CustomerAction = {
  addOne,
  loadAll,
  loadMoreCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  loadOrderDelivered,
  loadOrderDelivering
};

