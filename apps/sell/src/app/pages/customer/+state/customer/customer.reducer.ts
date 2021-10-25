import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Customer } from './customer.interface';
import { createReducer, on } from '@ngrx/store';
import { CustomerAction } from './customer.action';

export interface CustomerState extends EntityState<Customer> {
  loaded: boolean;
  added: boolean;
  selectedCustomerId: number
}

export const adapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();

export const initialCustomer = adapter.getInitialState({ loaded: false, added: true });

export const CustomerReducer = createReducer(
  initialCustomer,
  on(CustomerAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.customers, { ...state, loaded: true })
  ),

  on(CustomerAction.loadCustomersSuccess, (state, action) =>
    adapter.addMany(action.customers, { ...state, loaded: true })
  ),

  on(CustomerAction.getCustomerSuccess, (state, action) =>
    adapter.upsertOne(action.customer, { ...state, loaded: true, added: true })
  ),
  on(CustomerAction.updateCustomer, (state, _) => {
      return { ...state, added: false };
    }
  ),

  on(CustomerAction.addCustomer, (state, _) => {
      return { ...state, added: false };
    }
  ),

  on(CustomerAction.addCustomerSuccess, (state, action) =>
    adapter.addOne(action.customer, { ...state, added: true })
  )
);
export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
