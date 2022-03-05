import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerActions } from './customer.actions';
import { CustomerService } from '../service/customer.service';
import { SnackBarComponent } from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerQuery } from './customer.query';
import { CustomerStore } from './customer.store';
import { OrderService } from '../../order/service/order.service';
import { AddCustomerDto } from '../dto/add-customer.dto';

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
    ofType(CustomerActions.loadAll),
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
  addOne$ = this.action$.pipe(
    ofType(CustomerActions.addOne),
    switchMap((props: AddCustomerDto) => {
      if (!props?.provinceId) {
        throw this.snackBar.open('Tỉnh/Thành phố không được để trống!!');
      }
      return this.customerService.addOne(props);
    }),
    map((res) => {
        this.customerStore.update(res.id, res);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(CustomerActions.loadOne),
    switchMap((props) => this.customerService.getOne(props.id)),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(CustomerActions.update),
    switchMap((props) => this.customerService.update(props.id, props.updates).pipe(
      map((res) => this.customerStore.update(res.id, res)),
      catchError((err) => throwError(err))
    ))
  );

  @Effect()
  deleteCustomer$ = this.action$.pipe(
    ofType(CustomerActions.remove),
    switchMap((props) => this.customerService.delete(props.id).pipe(
      map(() => this.customerStore.remove(props.id)),
      catchError((err) => throwError(err))
    ))
  );

  @Effect()
  orderDelivered$ = this.action$.pipe(
    ofType(CustomerActions.loadOrderDelivered),
    switchMap(props => this.orderService.pagination(Object.assign(props, { status: 1 })).pipe(
      tap(res => {
        this.customerStore.update(props.customerId, { delivered: res.data });
        this.customerStore.update((state) => ({ ...state, deliveredLoading: false }));
      })
    ))
  );

  @Effect()
  orderDelivering$ = this.action$.pipe(
    ofType(CustomerActions.loadOrderDelivering),
    switchMap(props => this.orderService.pagination(Object.assign(props, { status: 0 })).pipe(
      tap(res => {
        this.customerStore.update(props.customerId, { delivering: res.data });
        this.customerStore.update((state) => ({ ...state, deliveringLoading: false }));
      })
    ))
  );
}
