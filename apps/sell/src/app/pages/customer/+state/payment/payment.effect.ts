import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PaymentAction } from './payment.action';
import { PaymentService } from '../../service/payment.Service';
import { CustomerAction } from '../customer/customer.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PaymentEffect {

  loadPayment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.loadInit),
      switchMap((props) => {
        return this.paymentService.pagination(props);
      }),
      map((ResponsePaginate) =>
        PaymentAction.loadInitSuccess({
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
      switchMap((props) => this.paymentService.payment(props.infoPayment)),
      map(res => {
          this.snackbar.open('Thanh toán thành công', '', { duration: 1500 });
          return PaymentAction.paymentSuccess({ payment: res });
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  UpdatePayment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.updatePayment),
      switchMap((props) => this.paymentService.update(props.id, props.infoPayment)),
      map(res => {
          this.snackbar.open('Cập nhật thành công', '', { duration: 1500 });
          return PaymentAction.updatePaymentSuccess({ payment: res });
        }
      ),
      catchError((err) => throwError(err))
    )
  );


  deletePayment$ = createEffect(() =>
    this.action$.pipe(
      ofType(PaymentAction.deletePayment),
      switchMap((props) => this.paymentService.delete(props.id).pipe(
        map(res => {
          this.snackbar.open('Xóa thành công', '', {duration: 1500})
            return PaymentAction.deletePaymentSuccess({ id: props.id });
          }
        )
      )),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly snackbar: MatSnackBar,
    private readonly paymentService: PaymentService
  ) {
  }
}
