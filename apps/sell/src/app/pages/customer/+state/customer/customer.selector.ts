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
  fromCustomer.selectEntities
);

export const selectorAllCustomer = createSelector(
  selectorCustomerState,
  fromCustomer.selectAll
);

export const selectorCurrentCustomer = (id?: number) => createSelector(
  selectorCustomerEntities,
  (CustomerEntities) => {
    if (id) {
      return CustomerEntities[id];
    } else {
      return undefined;
    }
  }
);

export const selectedCustomerLoaded = createSelector(
  selectorCustomerState,
  (state) => state.loaded
);

export const selectedCustomerAdded = createSelector(
  selectorCustomerState,
  (state) => state.added
);
export const selectorCustomerTotal = createSelector(
  selectorCustomerState,
  fromCustomer.selectTotal
);

