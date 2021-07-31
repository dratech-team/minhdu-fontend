import { createAction, props } from '@ngrx/store';
import { Payment } from './payment.interface';
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
  props<{ payments: PaymentHistory[]}>()
);

export const payment = createAction(
  '[PAYMENT] Customer Payment',
  props<{ infoPayment: any, id: number }>()
);


export const PaymentAction = {
  loadMorePayment,
  loadMorePaymentSuccess,
  payment,
  loadInit,
  loadInitSuccess,

}

