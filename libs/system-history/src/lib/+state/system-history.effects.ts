import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SystemHistoryService } from '../services/system-history.service';
import { throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SystemHistoryActions } from './system-history.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/src/lib/snackBar/snack-bar.component';
import { selectorAllSystemHistory } from './system-history.selectors';

@Injectable()
export class SystemHistoryEffects {

  loadInit$ = createEffect(() =>
    this.actions.pipe(
      ofType(SystemHistoryActions.loadSystemHistory),
      switchMap((props) => this.systemHistoryService.pagination(props)),
      map((responsePagination) =>
        SystemHistoryActions.loadSystemHistorySuccess({
          systemHistory: responsePagination.data, total: responsePagination.total
        })
      ),
      catchError(err => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.actions.pipe(
      ofType(SystemHistoryActions.loadMoreSystemHistory),
      switchMap((props) => {
          let total = 0;
          this.store.pipe(select(selectorAllSystemHistory)).subscribe(
            val => total = val.length
          );
          return this.systemHistoryService.pagination(
            Object.assign(JSON.parse(JSON.stringify(props)), { skip: total }));
        }
      ),
      map((responsePagination) => {
          if (responsePagination.data.length === 0) {
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { content: 'Đã lấy hết dữ liệu' },
              duration: 2500,
              panelClass: ['background-snackbar']
            });
          }
          return SystemHistoryActions.loadMoreSystemHistorySuccess(
            { systemHistory: responsePagination.data });
        }
      ),
      catchError(err => throwError(err))
    ));

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly systemHistoryService: SystemHistoryService,
    private readonly snackBar: MatSnackBar
  ) {
  }
}


