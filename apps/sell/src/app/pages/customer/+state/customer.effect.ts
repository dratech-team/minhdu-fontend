import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerAction } from './customer.action';
import { CustomerService } from '../service/customer.service';
import { SnackBarComponent } from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerQuery } from './customer.query';
import { CustomerStore } from './customer.store';
import { OrderService } from '../../order/service/order.service';

@Injectable()
export class CustomerEffect {
  constructor(
    private readonly action$: Actions,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery,
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar,
    private readonly orderService: OrderService
  ) {
  }

  @Effect()
  loadCustomers$ = this.action$.pipe(
    ofType(CustomerAction.loadAll),
    switchMap((props) => {
      const skip = this.customerQuery.getCount();
      return this.customerService.pagination(Object.assign(props, { skip: skip }));
    }),
    tap((response) => {
      if (response.data.length === 0) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 2500,
          panelClass: ['background-snackbar'],
          data: { content: 'Đã lấy hết khách hàng' }
        });
      } else {
        this.customerStore.add(response.data);
      }
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  addCustomer$ = this.action$.pipe(
    ofType(CustomerAction.addOne),
    switchMap((props) => {
      if (!props.customer?.provinceId) {
        throw this.snackBar.open('Tỉnh/Thành phố không được để trống!!');
      }
      return this.customerService.addOne(props.customer);
    }),
    map((res) => {
        this.customerStore.update(res.id, res);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(CustomerAction.loadOne),
    switchMap((props) => this.customerService.getOne(props.id)),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(CustomerAction.update),
    switchMap((props) => this.customerService.update(props.id, props.customer).pipe(
      map((res) => this.customerStore.update(res.id, res)),
      catchError((err) => throwError(err))
    ))
  );

  @Effect()
  deleteCustomer$ = this.action$.pipe(
    ofType(CustomerAction.remove),
    switchMap((props) => this.customerService.delete(props.id).pipe(
      map(() => this.customerStore.remove(props.id)),
      catchError((err) => throwError(err))
    ))
  );

  @Effect()
  orderDelivered$ = this.action$.pipe(
    ofType(CustomerAction.loadOrderDelivered),
    switchMap(props => this.orderService.pagination(Object.assign(props, { status: 1 })).pipe(
      tap(res => {
        this.customerStore.update(props.customerId, { delivered: res.data });
        this.customerStore.update((state) => ({ ...state, deliveredLoading: false }));
      })
    ))
  );

  @Effect()
  orderDelivering$ = this.action$.pipe(
    ofType(CustomerAction.loadOrderDelivering),
    switchMap(props => this.orderService.pagination(Object.assign(props, { status: 0 })).pipe(
      tap(res => {
        this.customerStore.update(props.customerId, { delivering: res.data });
        this.customerStore.update((state) => ({ ...state, deliveringLoading: false }));
      })
    ))
  );
}
