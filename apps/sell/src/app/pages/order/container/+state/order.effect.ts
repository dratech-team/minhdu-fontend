import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {  OrderService } from '../../service/order.service';
import { OrderAction } from './order.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class OrderEffect {
  addOrder$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.addOrder),
      switchMap((props) => this.billService.addOne(props.order).pipe(
        map(_ => OrderAction.loadInit({take:30, skip:0})),
        catchError((err) => throwError(err))
      )),

    ));
  loadInit$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.loadInit),
      switchMap((props) => this.billService.pagination(props)),
      map((responsePagination) => OrderAction.loadInitSuccess({orders:responsePagination.data} )),
      catchError((err) => throwError(err))
    ));

  loadMoreBills$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.loadMoreOrders),
      switchMap((props) => this.billService.pagination(props)),
      map((responsePagination) => OrderAction.loadMoreOrdersSuccess({orders:responsePagination.data} )),
      catchError((err) => throwError(err))
    ));

  getBill$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.getOrder),
      switchMap((props) => this.billService.getOne(props)),
      map((bill) => OrderAction.getOrderSuccess({order: bill} )),
      catchError((err) => throwError(err))
    ));

  updateBill$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.updateOrder),
      switchMap((props) => this.billService.update(props.id, props.order).pipe(
        map((_) => OrderAction.getOrder( {id:props.id} )),
        catchError((err) => throwError(err))
        )
      ),
    ));

  deleteBill$ = createEffect(()=>
    this.action.pipe(
      ofType(OrderAction.deleteOrder),
      switchMap((props) => this.billService.delete(props.id).pipe(
        map((_) => OrderAction.loadInit( {take:30, skip:0})),
        catchError((err) => throwError(err))
        )
      ),
    ));

  constructor(
    private readonly action: Actions,
    private readonly billService : OrderService,
  ) {
  }
}
