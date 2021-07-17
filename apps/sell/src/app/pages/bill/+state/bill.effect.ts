import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BillService } from '../service/bill.service';
import { BillAction } from './bill.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class BillEffect{
  loadInit$ = createEffect(()=>
  this.action.pipe(
    ofType(BillAction.loadInit),
    switchMap((props) => this.billService.pagination(props)),
    map((responsePagination)=> BillAction.loadInitSuccess({bills: responsePagination.data})),
    catchError(err=> throwError(err))
  ))
  loadMore$ = createEffect(()=>
    this.action.pipe(
      ofType(BillAction.loadMoreBills),
      switchMap((props) => this.billService.pagination(props)),
      map((responsePagination)=> BillAction.loadMoreBillsSuccess({bills: responsePagination.data})),
      catchError(err=> throwError(err))
    ))
  constructor(
    private readonly action: Actions,
    private readonly billService: BillService,
  ) {
  }
}
