import { PaymentState } from './payment.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formPayment from './payment.reducer';
import { Payment } from './payment.interface';
import { PaymentHistory } from '@minhdu-fontend/data-models';

export interface state {
  payment: PaymentState,
}

export const getSelectedCustomerId = (state: PaymentHistory) => state.id;
export const selectorPaymentState = createFeatureSelector<PaymentState>(
  FeatureName.PAYMENT
);
export const selectorPaymentEntities = createSelector(
  selectorPaymentState,
  formPayment.selectEntities
);

export const selectorAllPayment = createSelector(
  selectorPaymentState,
  formPayment.selectAll
);

export const selectorCurrentCustomer = (id: number) => createSelector(
  selectorPaymentEntities,
  (PaymentEntities) => {
    return PaymentEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorPaymentState,
  (state) => state.loaded
);

export const selectedAdded = createSelector(
  selectorPaymentState,
  (state) => state.added
);

