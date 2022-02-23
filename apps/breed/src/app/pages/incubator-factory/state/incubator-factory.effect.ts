import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { IncubatorFactoryService } from '../services/incubator-factory.service';
import { IncubatorFactoryStore } from './incubator-factory.store';
import { IncubatorFactoryActions } from './incubator-factory.action';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
    tap((data) => {
      this.store.upsert(data?.id, data);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadIncubatorFactory$ = this.action$.pipe(
    ofType(IncubatorFactoryActions.loadAll),
    switchMap(props => this.service.getAll(props)),
    tap((data) => {
      this.store.set(data);
    }),
    catchError((err) => throwError(err))
  );
}
