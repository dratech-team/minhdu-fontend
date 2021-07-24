import { createAction, props } from '@ngrx/store';
import { Customer } from './customer.interface';


export const addCustomer = createAction(
  '[ADD_CUSTOMER] Add Customer',
  props<{ customer: any }>()
);

export const loadInit = createAction(
  '[LOAD_CUSTOMER] Load Init',
  props<{
    skip: number,
    take: number,
    type?: string,
    resource?: string,
    isPotential?: boolean,
    phone?:number,
    nationId?:number,
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
    isPotential?: boolean,
    phone?:number,
    nationId?:number,
  }>()
);

export const loadCustomersSuccess = createAction(
  '[LOAD_MORE_CUSTOMER] Load More Customer Success',
  props<{ customers: Customer[]}>()
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

export const payment = createAction(
  '[PAYMENT] Customer Payment',
  props<{ infoPayment: any, id: number }>()
);

export const deleteCustomer = createAction(
  '[DELETE_CUSTOMER] Delete Customer',
  props<{ id: number, customerId?: number }>()
);

export const CustomerAction = {
  payment,
  addCustomer,
  loadInit,
  loadInitSuccess,
  loadMoreCustomers,
  loadCustomersSuccess,
  getCustomer,
  getCustomerSuccess,
  updateCustomer,
  deleteCustomer,
}

