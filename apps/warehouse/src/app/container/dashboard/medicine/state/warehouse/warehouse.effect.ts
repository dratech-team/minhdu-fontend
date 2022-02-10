import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WarehouseService } from '../warehouse.service';
import { WarehouseAction } from './warehouse.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class WarehouseEffect {
  loadProducts$ = createEffect(() =>
    this.action$.pipe(
      ofType(WarehouseAction.loadProduct),
      switchMap((props) => {
        return this.service.pagination(props);
      }),
      map((ResponsePaginate) => WarehouseAction.loadProductSuccess({
        products: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly service: WarehouseService
  ) {
  }
}
