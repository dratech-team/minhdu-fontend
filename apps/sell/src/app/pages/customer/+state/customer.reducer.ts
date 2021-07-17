import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Customer } from './customer.interface';
import { createReducer, on } from '@ngrx/store';
import { CustomerAction } from './customer.action';

export interface CustomerState extends EntityState<Customer> {
  loaded: boolean;
  selectedCustomerId: number
}

export const adapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();

export const initialCustomer = adapter.getInitialState({ loaded: false });

export const customerReducer = createReducer(
  initialCustomer,
  on(CustomerAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.customers, { ...state, loaded: true })
  ),

  on(CustomerAction.loadCustomersSuccess, (state, action) =>
    adapter.addMany(action.customers, { ...state, loaded: true})
  ),

  on(CustomerAction.getCustomerSuccess, (state, action) =>
    adapter.upsertOne(action.customers, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
