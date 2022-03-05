import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { combineLatest, throwError } from 'rxjs';
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

  loadCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadInit),
      switchMap((props) => this.customerService.pagination(props)),
      tap((ResponsePaginate) => {
        console.log(ResponsePaginate);
        this.customerStore.set(ResponsePaginate.data);
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMoreCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadMoreCustomers),
      withLatestFrom(this.customerQuery.selectCount()),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap((props) => {
        return this.customerService.pagination(props);
      }),
      map((ResponsePaginate) => {
          if (ResponsePaginate.data.length === 0) {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 2500,
              panelClass: ['background-snackbar'],
              data: { content: 'Đã lấy hết khách hàng' }
            });
          }
          this.customerStore.add(ResponsePaginate.data);
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  addCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.addCustomer),
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
    )
  );

  getCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.getCustomer),
      switchMap((props) => this.customerService.getOne(props.id).pipe(
        combineLatest([
          this.orderService.getAll({ customerId: props.customerId }),
          this.orderService.getAll({ customerId: props.customerId })
        ]).pipe(map(([delivered, delivering]) => {
          return [];
        }))
      )),
      catchError((err) => throwError(err))
    )
  );

  updateCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.updateCustomer),
      switchMap((props) => this.customerService.update(props.id, props.customer).pipe(
        map((res) => this.customerStore.update(res.id, res)),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.deleteCustomer),
      switchMap((props) => this.customerService.delete(props.id).pipe(
        map(() => this.customerStore.remove(props.id)),
        catchError((err) => throwError(err))
      ))
    )
  );
}
