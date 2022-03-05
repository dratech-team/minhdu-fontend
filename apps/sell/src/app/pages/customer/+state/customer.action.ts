import { createAction, props } from '@datorama/akita-ng-effects';
import { Customer } from './customer.interface';
import { CustomerType, Gender } from '@minhdu-fontend/enums';

export const addCustomer = createAction(
  '[ADD_CUSTOMER] Add Customer',
  props<{ customer: any }>()
);

export const addCustomerSuccess = createAction(
  '[ADD_CUSTOMER] Add Customer Success',
  props<{ customer: Customer }>()
);

export const loadInit = createAction(
  '[LOAD_CUSTOMER] Load Init',
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


export const loadInitSuccess = createAction(
  '[LOAD_CUSTOMER] Load Init Success',
  props<{ customers: Customer[] }>()
);

export const loadMoreCustomers = createAction(
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

export const loadCustomersSuccess = createAction(
  '[LOAD_MORE_CUSTOMER] Load More Customer Success',
  props<{ customers: Customer[] }>()
);

export const getCustomer = createAction(
  '[GET_CUSTOMER] Get Customer ',
  props<{ id: number }>()
);

export const getCustomerSuccess = createAction(
  '[GET_CUSTOMER] Get Customer Success',
  props<{ customer: Customer }>()
);

export const updateCustomer = createAction(
  '[UPDATE_CUSTOMER] Update Customer',
  props<{ customer: any, id: number }>()
);


export const deleteCustomer = createAction(
  '[DELETE_CUSTOMER] Delete Customer',
  props<{ id: number, customerId?: number }>()
);

export const CustomerAction = {
  addCustomer,
  addCustomerSuccess,
  loadInit,
  loadInitSuccess,
  loadMoreCustomers,
  loadCustomersSuccess,
  getCustomer,
  getCustomerSuccess,
  updateCustomer,
  deleteCustomer
};

