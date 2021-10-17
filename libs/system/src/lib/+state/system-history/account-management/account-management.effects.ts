import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../components/src/lib/snackBar/snack-bar.component';
import { AccountManagementService } from '../../services/account-management.service';
import { AccountManagementActions } from './account-management.actions';
import { selectorAccountTotal } from './account-management.selectors';

@Injectable()
export class AccountManagementEffects {
  loadInit$ = createEffect(() =>
    this.actions.pipe(
      ofType(AccountManagementActions.loadInit),
      switchMap((props) => this.accountManagementService.getAll(props.accountDTO)),
      map((res) =>
        AccountManagementActions.loadInitSuccess({
          accounts: res,
        })
      ),
      catchError((err) => throwError(err))
    )
  );

  loadMore$ = createEffect(() =>
    this.actions.pipe(
      ofType(AccountManagementActions.loadMoreAccount),
      withLatestFrom(this.store.pipe(select(selectorAccountTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props.accountDTO)), { skip: skip })
      ),
      switchMap((props) => {
        return this.accountManagementService.getAll(props);
      }),
      map((res) => {
        if (selectorAccountTotal.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { content: 'Đã lấy hết dữ liệu' },
            duration: 2500,
            panelClass: ['background-snackbar']
          });
        }
        return AccountManagementActions.loadMoreAccountSuccess({
          accounts: res
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly accountManagementService: AccountManagementService,
    private readonly snackBar: MatSnackBar
  ) {
  }
}


