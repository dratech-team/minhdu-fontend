import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PaymentAction } from './payment.action';
import { PaymentService } from '../../service/payment.Service';
import { CustomerAction } from '../customer/customer.action';

@Injectable()
export class PaymentEffect {

  loadPayment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.loadInit),
      switchMap((props) => {
        return this.paymentService.pagination(props);
      }),
      map((ResponsePaginate) => PaymentAction.loadInitSuccess({
        payments: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );

  loadMorePayment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.loadMorePayment),
      switchMap((props) => this.paymentService.pagination(props)),
      map((ResponsePaginate) => PaymentAction.loadMorePaymentSuccess({ payments: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  payment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.payment),
      switchMap((props) => this.paymentService.payment(props.id, props.infoPayment).pipe(
        map(_=> CustomerAction.getCustomer({id: props.id}))
      )),
        catchError((err) => throwError(err))
    )
  );
  constructor(
    private readonly action$: Actions,
    private readonly paymentService: PaymentService
  ) {
  }
}
