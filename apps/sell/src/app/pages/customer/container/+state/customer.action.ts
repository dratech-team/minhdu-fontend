import { RequestPaginate } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';
import { Customer } from './customer.interface';


export const addCustomer = createAction(
  '[ADD_CUSTOMER] Add Customer',
  props<{ customer: Customer }>()
);

export const addCustomerSuccess = createAction(
  '[ADD_CUSTOMER] Add Customer Success',
  props<{ customer: Customer[]}>()
);

export const loadCustomers = createAction(
  '[LOAD_CUSTOMER] Load Employee',
  props<{ RequestPaginate: RequestPaginate }>()
);

export const loadCustomersSuccess = createAction(
  '[LOAD_CUSTOMER] Load Customer Success',
  props<{ customers: Customer[] }>()
);

export const updateCustomer = createAction(
  '[UPDATE_CUSTOMER] Update Customer',
  props<{ customer: any, customerId?: number }>()
);

export const deleteCustomer = createAction(
  '[DELETE_CUSTOMER] Update Customer',
  props<{ id: number, customerId?: number }>()
);
export const CustomerAction = {
  addCustomer,
  addCustomerSuccess,
  loadCustomers,
  loadCustomersSuccess,
  updateCustomer,
  deleteCustomer,
}

