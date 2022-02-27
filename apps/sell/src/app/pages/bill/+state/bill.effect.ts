import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { BillService } from '../service/bill.service';
import { BillAction } from './bill.action';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BillStore } from './bill.store';

@Injectable()
export class BillEffect {
  constructor(
    private readonly action: Actions,
    private readonly billService: BillService,
    private readonly billStore: BillStore
  ) {
  }

  @Effect()
  loadInit$ = this.action.pipe(
    ofType(BillAction.loadInit),
    switchMap((props) => this.billService.pagination(props)),
    tap((response) => {
      this.billStore.set(response.data);
    }),
    catchError(err => throwError(err))
  );

  @Effect()
  loadMore$ = this.action.pipe(
    ofType(BillAction.loadMoreBills),
    switchMap((props) => this.billService.pagination(props)),
    tap((response) => this.billStore.add(response.data)),
    catchError(err => throwError(err))
  );
}
