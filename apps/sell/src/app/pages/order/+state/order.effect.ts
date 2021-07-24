import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrderService } from '../service/order.service';
import { OrderAction } from './order.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class OrderEffect {
  addOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.addOrder),
      switchMap((props) => this.orderService.addOne(props.order).pipe(
        map(_ => OrderAction.loadInit({ take: 30, skip: 0 })),
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

  updateBill$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.updateOrder),
      switchMap((props) => this.orderService.update(props.id, props.order).pipe(
        map((_) => OrderAction.getOrder({ id: props.id })),
        catchError((err) => throwError(err))
        )
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


  deleteBill$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.deleteOrder),
      switchMap((props) => this.orderService.delete(props.id).pipe(
        map((_) => OrderAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
        )
      )
    ));

  constructor(
    private readonly action: Actions,
    private readonly orderService: OrderService
  ) {
  }
}
