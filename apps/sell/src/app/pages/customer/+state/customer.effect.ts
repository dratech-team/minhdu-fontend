import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerAction, loadMoreCustomers } from './customer.action';
import { CustomerService } from '../service/customer.service';

@Injectable()
export class CustomerEffect {

  loadCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadInit),
      switchMap((props) =>
        this.customerService.pagination(props)),
      map((ResponsePaginate) => CustomerAction.loadInitSuccess({ customers: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreCustomers$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadMoreCustomers),
      switchMap((props) => this.customerService.pagination(props)),
      map((ResponsePaginate) => CustomerAction.loadCustomersSuccess({ customers: ResponsePaginate.data })),
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
      map((customer) => CustomerAction.getCustomerSuccess({ customers: customer })),
      catchError((err) => throwError(err))
    )
  );

  updateCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.updateCustomer),
      switchMap((props) => this.customerService.update(props.id, props.customer).pipe(
        map(() => CustomerAction.getCustomer({id: props.id})),
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
    private readonly customerService: CustomerService
  ) {
  }
}
