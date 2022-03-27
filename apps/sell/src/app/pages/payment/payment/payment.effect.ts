import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PaymentAction } from './payment.action';
import { PaymentService } from '../../customer/service';
import { CustomerActions } from '../../customer/+state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { OrderActions } from '../../order/+state';
import { ConvertBoolean } from '@minhdu-fontend/enums';

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
        this.store.dispatch(OrderActions.loadOrdersAssigned({
          take: 30,
          skip: 0,
          customerId: res.customerId,
          status: ConvertBoolean.TRUE
        }));
        this.store.dispatch(OrderActions.loadAll({
          orderDTO: {
            take: 30,
            skip: 0,
            customerId: res.customerId
          }
        }));
        this.store.dispatch(CustomerActions.loadOne({ id: res.customerId }));
        return res;
      }),
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
      switchMap((props) => this.paymentService.updatePayment(props.id, props.infoPayment)),
      map(res => {
        this.store.dispatch(OrderActions.loadOrdersAssigned({
          take: 30,
          skip: 0,
          customerId: res.customerId,
          status: ConvertBoolean.TRUE
        }));
        this.store.dispatch(OrderActions.loadAll({
          orderDTO: {
            take: 30,
            skip: 0,
            customerId: res.customerId
          }
        }));
        this.store.dispatch(CustomerActions.loadOne({ id: res.customerId }));
        return res;
      }),
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
      switchMap((props) =>
        this.paymentService.delete(props.id).pipe(
          map(_ => {
            this.snackbar.open('Xóa lịch sử thanh toán thành công', '', { duration: 1500 });
            this.store.dispatch(PaymentAction.deletePaymentSuccess({ id: props.id }));
          }),
          map(_ => {
            this.store.dispatch(OrderActions.loadOrdersAssigned({
              take: 30,
              skip: 0,
              customerId: props.customerId,
              status: ConvertBoolean.TRUE
            }));
            this.store.dispatch(OrderActions.loadAll({
              orderDTO: {
                take: 30,
                skip: 0,
                customerId: props.customerId
              }
            }));
            return CustomerActions.loadOne({ id: props.customerId });
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly paymentService: PaymentService
  ) {
  }
}
