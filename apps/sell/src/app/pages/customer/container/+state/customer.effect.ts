import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerAction } from './customer.action';
import { CustomerService } from '../service/customer.service';

@Injectable()
export class CustomerEffect {

  loadCustomer$ = createEffect(() =>
    this.action$.pipe(
      ofType(CustomerAction.loadCustomers),
      switchMap((props) => this.customerService.pagination(props.RequestPaginate)),
      map((ResponsePaginate) => CustomerAction.loadCustomersSuccess({ customers: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );
  constructor(
    private readonly action$: Actions,
    private readonly customerService: CustomerService,
  ) {
  }
}
