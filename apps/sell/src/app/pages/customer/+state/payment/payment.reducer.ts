import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createReducer, on } from '@ngrx/store';
import { PaymentAction } from './payment.action';

import { PaymentHistory } from '@minhdu-fontend/data-models';

export interface PaymentState extends EntityState<PaymentHistory> {
  loaded: boolean;
  selectedCustomerId: number
}

export const adapter: EntityAdapter<PaymentHistory> = createEntityAdapter<PaymentHistory>();

export const initialPayment= adapter.getInitialState({ loaded: false });

export const PaymentReducer = createReducer(
  initialPayment,
  on(PaymentAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.payments, { ...state, loaded: true })
  ),

  on(PaymentAction.loadMorePaymentSuccess, (state, action) =>
    adapter.addMany(action.payments, { ...state, loaded: true})
  ),

);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
