import { createAction, props } from '@ngrx/store';
import { PaymentHistory } from '@minhdu-fontend/data-models';


export const loadInit = createAction(
  '[LOAD_PAYMENT] Load Init',
  props<{
    skip: number,
    take: number,
    customerId: number,
  }>()
);

export const loadMorePayment = createAction(
  '[LOAD_PAYMENT] Load More Payment',
  props<{
    skip: number,
    take: number,
    customerId: number,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_PAYMENT] Load Init Success',
  props<{ payments: PaymentHistory[] }>()
);

export const loadMorePaymentSuccess = createAction(
  '[LOAD_MORE_CUSTOMER] Load More Payment Success',
  props<{ payments: PaymentHistory[] }>()
);

export const payment = createAction(
  '[PAYMENT] Customer Payment',
  props<{ infoPayment: any }>()
);

export const paymentSuccess = createAction(
  '[PAYMENT_SUCCESS] Customer Payment Success',
  props<{ payment: PaymentHistory }>()
);

export const updatePayment = createAction(
  '[PAYMENT] Update Payment',
  props<{ id: number, infoPayment: any }>()
);

export const updatePaymentSuccess = createAction(
  '[PAYMENT] Update Payment Success',
  props<{ payment: PaymentHistory }>()
);

export const deletePayment = createAction(
  '[PAYMENT] Delete Payment',
  props<{ id: number, customerId: number }>()
);

export const deletePaymentSuccess = createAction(
  '[PAYMENT] Delete Payment Success',
  props<{ id: number }>()
);
export const handlePaymentError = createAction(
  '[PAYMENT] Handle Payment Error'
);
export const PaymentAction = {
  loadMorePayment,
  loadMorePaymentSuccess,
  payment,
  loadInit,
  loadInitSuccess,
  paymentSuccess,
  updatePayment,
  updatePaymentSuccess,
  deletePayment,
  deletePaymentSuccess,
  handlePaymentError
};

