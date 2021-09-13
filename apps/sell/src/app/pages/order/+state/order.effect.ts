import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrderService } from '../service/order.service';
import { OrderAction } from './order.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarSuccessComponent } from 'libs/components/src/lib/snackBar-success/snack-bar-success.component';
import { Store } from '@ngrx/store';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { CommodityAction } from '../../commodity/+state/commodity.action';


@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;
  addOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.addOrder),
      switchMap((props) => this.orderService.addOne(props.order).pipe(
        map(order => {
          return OrderAction.addOrderSuccess({ order: order });
        }),
        tap(_ => {
          this.snackBar.openFromComponent(SnackBarSuccessComponent, {
            duration: 2500,
            panelClass: ['background-snackbar']
          });
        }),
        map(_ => CommodityAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  loadInit$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadInit),
      switchMap((props) => this.orderService.pagination(props)),
      map((responsePagination) => OrderAction.loadInitSuccess({ orders: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadOrdersAssigned$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadOrdersAssigned),
      switchMap((props) => {
        return this.orderService.pagination(props);
      }),
      map((responsePagination) => {
          return OrderAction.loadOrdersAssignedSuccess({ orders: responsePagination.data });
        }
      ),
      catchError((err) => throwError(err))
    ));

  loadMoreOrdersAssigned$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadMoreOrdersAssigned),
      switchMap((props) => this.orderService.pagination(props)),
      map((responsePagination) =>
        OrderAction.loadMoreOrdersAssignedSuccess({ orders: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadMoreBills$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadMoreOrders),
      switchMap((props) => this.orderService.pagination(props)),
      map((responsePagination) => OrderAction.loadMoreOrdersSuccess({ orders: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  getOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.getOrder),
      switchMap((props) => this.orderService.getOne(props.id)),
      map((order) => OrderAction.getOrderSuccess({ order: order })),
      catchError((err) => throwError(err))
    ));

  updateOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.updateOrder),
      switchMap((props) => this.orderService.update(props.id, props.order).pipe(
        map((_) => {
            switch (props.typeUpdate) {
              case 'DELIVERED':
                return OrderAction.loadInit({ take: 30, skip: 0 });
              case 'HIDE_DEBT':
                return OrderAction.loadOrdersAssigned({ take: 30, skip: 0, delivered: this.convertBoolean.TRUE });
              default:
                return OrderAction.getOrder({ id: props.id });
            }
          }
        ),
        catchError((err) => {
          if (props.typeUpdate === 'HIDE_DEBT') {
            this.store.dispatch(OrderAction.loadOrdersAssigned({
              take: 30,
              skip: 0,
              delivered: this.convertBoolean.TRUE
            }));
          }
          return throwError(err);
        }))
      )
    ));

  paymentBill$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.payment),
      switchMap((props) => this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderAction.getOrder({ id: props.id })),
        catchError((err) => throwError(err))
        )
      )
    ));

  deleteOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.deleteOrder),
      switchMap((props) => this.orderService.delete(props.id).pipe(
        map((_) => OrderAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
        )
      )
    ));

  constructor(
    private snackBar: MatSnackBar,
    private readonly action: Actions,
    private readonly orderService: OrderService,
    private readonly store: Store
  ) {
  }
}

