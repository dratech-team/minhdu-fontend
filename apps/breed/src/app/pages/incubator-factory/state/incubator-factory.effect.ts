import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from '../services/incubator-factory.service';
import { IncubatorFactoryStore } from './incubator-factory.store';
import { IncubatorFactoryActions } from './incubator-factory.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class IncubatorFactoryEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: IncubatorFactoryService,
    private readonly store: IncubatorFactoryStore
  ) {
  }

  @Effect()
  addEgg$ = this.action$.pipe(
    ofType(IncubatorFactoryActions.addEgg),
    switchMap(props => this.service.addOne(props)),
    switchMap(data => this.service.getOne(data.id)),
    tap((data) => {
      this.store.upsert(data?.id, data);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadIncubatorFactory$ = this.action$.pipe(
    ofType(IncubatorFactoryActions.loadAll),
    switchMap(props => this.service.pagination(props)),
    map(({ data }) => {
      return data.map((incubator) => {
        // const amountAdded = incubator.eggs.filter(egg => egg.type.added).map(a => a.amount).reduce((a, b) => a + b, 0);
        // const amount = incubator.eggs.map(a => a.amount).reduce((a, b) => a + b, 0);

        // incubator.eggs.push({
        //   type: {
        //     id: -1,
        //     name: 'Tổng soi loại',
        //     added: false,
        //     rated: true
        //   },
        //   amount: amountAdded,
        //   rate: amountAdded / amount
        // });
        return incubator;
      });
    }),
    tap((data) => {
      this.store.set(data);
    }),
    catchError((err) => throwError(err))
  );
}
