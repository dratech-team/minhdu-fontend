import { CustomerState } from './customer.reducer';
import { Customer } from './customer.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromCustomer from './customer.reducer';

export interface state {
  customer: CustomerState,
}

export const getSelectedCustomerId = (state: Customer) => state.id;
export const selectorCustomerState = createFeatureSelector<CustomerState>(
  FeatureName.CUSTOMER
);
export const selectorCustomerEntities = createSelector(
  selectorCustomerState,
  fromCustomer.selectEntities,
);

export const selectorAllCustomer = createSelector(
  selectorCustomerState,
  fromCustomer.selectAll
);

export const selectorCurrentCustomer = (id?: number) => createSelector(
  selectorCustomerEntities,
  (CustomerEntities) => {
    let result: Customer|undefined
    if(id){
      result =  CustomerEntities[id]
    }
    return result
  }
);

export const selectedLoaded = createSelector(
  selectorCustomerState,
  (state) => state.loaded
);


