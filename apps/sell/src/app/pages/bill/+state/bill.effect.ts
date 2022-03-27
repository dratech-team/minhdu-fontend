import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { BillService } from '../service';
import { BillAction } from './bill.action';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BillStore } from './bill.store';

@Injectable()
export class BillEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly billStore: BillStore,
    private readonly billService: BillService
  ) {
  }

  @Effect()
  loadInit$ = this.actions$.pipe(
    ofType(BillAction.loadAll),
    switchMap((props) => this.billService.pagination(props)),
    tap((response) => {
      this.billStore.add(response.data);
    }),
    catchError(err => throwError(err))
  );
}
