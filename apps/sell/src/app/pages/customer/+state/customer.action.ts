import { createAction, props } from '@datorama/akita-ng-effects';
import { CustomerType, Gender } from '@minhdu-fontend/enums';

const addCustomer = createAction(
  '[ADD_CUSTOMER] Add Customer',
  props<{ customer: any }>()
);

const loadInit = createAction(
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

export const CustomerAction = {
  addCustomer,
  loadInit,
  loadMoreCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
};

