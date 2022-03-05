import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { OrderActions } from '../../../pages/order/+state/order.actions';
import { OrderQuery } from '../../../pages/order/+state/order.query';
import { Actions } from '@datorama/akita-ng-effects';

@Injectable({providedIn: 'root'})
export class TableOrderCustomerService {
  orders$ = this.orderQuery.selectAll();

  constructor(
    private readonly orderQuery: OrderQuery,
    private readonly actions$: Actions,
  ) {
  }

  searchOrders(val: any){
    this.actions$.dispatch(OrderActions.loadAll(val));
  }

  searchOrdersAssigned(val: any){
    // this.actions$.dispatch(OrderAction.loadOrdersAssigned(val));
  }

  scrollOrders(val: any){
    this.actions$.dispatch(OrderActions.loadAll(val));
  }

  scrollOrdersAssigned(val: any){
    // this.actions$.dispatch(OrderAction.loadMoreOrdersAssigned(val));
  }

  getCustomers() {
    return this.orders$
  }
}
