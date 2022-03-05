import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createReducer, on } from '@ngrx/store';
import { PaymentAction } from './payment.action';

import { PaymentHistory } from '@minhdu-fontend/data-models';

export interface PaymentState extends EntityState<PaymentHistory> {
  loaded: boolean;
  added: boolean;
  selectedCustomerId: number
}

export const adapter: EntityAdapter<PaymentHistory> = createEntityAdapter<PaymentHistory>();

export const initialPayment = adapter.getInitialState({ loaded: false, added: false });

export const PaymentReducer = createReducer(
  initialPayment,
  on(PaymentAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.payments, { ...state, loaded: true })
  ),

  on(PaymentAction.loadMorePaymentSuccess, (state, action) =>
    adapter.addMany(action.payments, { ...state, loaded: true })
  ),

  on(PaymentAction.payment, (state, _) => {
      return { ...state, added: false };
    }
  ),

  on(PaymentAction.paymentSuccess, (state, { payment }) =>
    adapter.upsertOne(payment, { ...state, added: true })
  ),

  on(PaymentAction.updatePaymentSuccess, (state, { payment }) =>
    adapter.updateOne({ id: payment.id, changes: payment }, { ...state, added: true })
  ),

  on(PaymentAction.deletePaymentSuccess, (state, { id }) => {
      return adapter.removeOne(id, { ...state });
    }
  )
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
