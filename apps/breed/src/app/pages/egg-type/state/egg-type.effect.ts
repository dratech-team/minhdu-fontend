import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { EggTypeService } from '../services/egg-type.service';
import { EggTypeStore } from './egg-type.store';
import { EggTypeActions } from './egg-type.action';
import { switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class EggTypeEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: EggTypeService,
    private readonly store: EggTypeStore
  ) {}

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(EggTypeActions.addOne),
    switchMap((props) => this.service.addOne(props)),
    tap((data) => this.store.add(data))
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(EggTypeActions.loadAll),
    switchMap(() => this.service.getAll()),
    tap((data) => this.store.set(data))
  );
}
