import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerAction } from './customer.action';
import { CustomerService } from '../service/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerStore } from './customer.store';

@Injectable()
export class CustomerEffect {
  constructor(
    private readonly action$: Actions,
    private readonly snackBar: MatSnackBar,
    private readonly store: CustomerStore,
    private readonly customerService: CustomerService
  ) {
  }

  @Effect()
  loadCustomers$ = this.action$.pipe(
    ofType(CustomerAction.loadInit),
    switchMap((props) => this.customerService.pagination(props)),
    map((ResponsePaginate) => CustomerAction.loadInitSuccess({
      customers: ResponsePaginate.data
    })),
    catchError((err) => throwError(err))
  );

  @Effect()
  addCustomer$ = this.action$.pipe(
    ofType(CustomerAction.addCustomer),
    switchMap((props) => {
      if (!props.customer?.provinceId) {
        throw this.snackBar.open('Tỉnh/Thành phố không được để trống!!');
      }
      return this.customerService.addOne(props.customer);
    }),
    map((res) => {
        return CustomerAction.addCustomerSuccess({ customer: res });
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(CustomerAction.getCustomer),
    switchMap((props) => this.customerService.getOne(props.id)),
    tap((customer) => {
      this.store.update(customer.id, customer);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(CustomerAction.updateCustomer),
    switchMap((props) => this.customerService.update(props.id, props.customer)),
    // map(() => CustomerAction.getCustomer({ id: props.id })),
    catchError((err) => throwError(err))
  );

  @Effect()
  deleteCustomer$ = this.action$.pipe(
    ofType(CustomerAction.deleteCustomer),
    switchMap((props) => this.customerService.delete(props.id).pipe(
      map(() => CustomerAction.loadInit({ take: 30, skip: 0 })),
      catchError((err) => throwError(err))
    ))
  );
}
