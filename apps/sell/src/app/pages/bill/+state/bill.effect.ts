import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { BillService } from '../service/bill.service';
import { BillAction } from './bill.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Effect } from '@datorama/akita-ng-effects';

@Injectable()
export class BillEffect {
  constructor(
    private readonly action: Actions,
    private readonly billService: BillService
  ) {
  }

  @Effect()
  loadInit$ = this.action.pipe(
    ofType(BillAction.loadInit),
    switchMap((props) => this.billService.pagination(props)),
    map((responsePagination) => BillAction.loadInitSuccess({ bills: responsePagination.data })),
    catchError(err => throwError(err))
  );

  @Effect()
  loadMore$ = this.action.pipe(
    ofType(BillAction.loadMoreBills),
    switchMap((props) => this.billService.pagination(props)),
    map((responsePagination) => BillAction.loadMoreBillsSuccess({ bills: responsePagination.data })),
    catchError(err => throwError(err))
  );
}
