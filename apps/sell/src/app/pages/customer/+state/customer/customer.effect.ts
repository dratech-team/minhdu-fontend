import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerAction } from './customer.action';
import { CustomerService } from '../../service/customer.service';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { selectorAllCustomer } from './customer.selector';

@Injectable()
export class CustomerEffect {

  loadCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadInit),
      switchMap((props) => this.customerService.pagination(props)),
      map((ResponsePaginate) => CustomerAction.loadInitSuccess({
        customers: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadMoreCustomers),
      switchMap((props) => {
        let total = 0;
        this.store.pipe(select(selectorAllCustomer)).subscribe(
          val => total = val.length
        );
        return this.customerService.pagination(
          Object.assign(JSON.parse(JSON.stringify(props)), { skip: total })
        );
      }),
      map((ResponsePaginate) => {
          if (ResponsePaginate.data.length === 0) {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 2500,
              panelClass: ['background-snackbar'],
              data: { content: 'Đã lấy hết khách hàng' }
            });
          }
          return CustomerAction.loadCustomersSuccess({ customers: ResponsePaginate.data });
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  addCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.addCustomer),
      switchMap((props) => this.customerService.addOne(props.customer).pipe(
        map(() => CustomerAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.getCustomer),
      switchMap((props) => this.customerService.getOne(props.id)),
      map((customer) => CustomerAction.getCustomerSuccess({ customer: customer })),
      catchError((err) => throwError(err))
    )
  );

  updateCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.updateCustomer),
      switchMap((props) => this.customerService.update(props.id, props.customer).pipe(
        map(() => CustomerAction.getCustomer({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.deleteCustomer),
      switchMap((props) => this.customerService.delete(props.id).pipe(
        map(() => CustomerAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly customerService: CustomerService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {
  }
}
