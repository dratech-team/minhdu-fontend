import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SystemHistoryService } from '../services/system-history.service';
import { throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SystemHistoryActions } from './system-history.actions';
import { selectorAllSystemHistory } from './system-history.selectors';

@Injectable()
export class SystemHistoryEffects {
  loadInit$ = createEffect(() =>
    this.actions.pipe(
      ofType(SystemHistoryActions.loadSystemHistory),
      switchMap((props) => this.systemHistoryService.pagination(props)),
      map((responsePagination) =>
        SystemHistoryActions.loadSystemHistorySuccess({
          systemHistory: responsePagination.data, total: responsePagination.total})),
      catchError(err => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.actions.pipe(
      ofType(SystemHistoryActions.loadMoreSystemHistory),
      switchMap((props) =>this.systemHistoryService.pagination(props)
      ),
      map((responsePagination) =>
        SystemHistoryActions.loadMoreSystemHistorySuccess(
          { systemHistory: responsePagination.data, total: responsePagination.total })),
      catchError(err => throwError(err))
    ));

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly systemHistoryService: SystemHistoryService
  ) {
  }
}
