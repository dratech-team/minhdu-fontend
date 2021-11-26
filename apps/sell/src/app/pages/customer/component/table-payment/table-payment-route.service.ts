import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllPayment } from '../../+state/payment/payment.selector';
import { PaymentAction } from '../../+state/payment/payment.action';

@Injectable({providedIn: 'root'})
export class TablePaymentRouteService {
  paymentHistories$ = this.store.pipe(select(selectorAllPayment))
  constructor(
    private readonly store: Store,
  ) {
  }
  scrollPayments(val: any){
    this.store.dispatch(PaymentAction.loadMorePayment(val));
  }
  searchPayments(val: any){
    this.store.dispatch(PaymentAction.loadInit(val))
  }
  getPayment() {
    return this.paymentHistories$
  }
}
