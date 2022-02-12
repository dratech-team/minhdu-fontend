import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { ProviderStore } from './provider.store';
import { ProviderService } from '../services/provider.service';
import { ProviderActions } from './provider.action';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class ProviderEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ProviderService,
    private readonly providerStore: ProviderStore
  ) {
  }

  @Effect()
  loadProviders$ = this.action$.pipe(
    ofType(ProviderActions.loadProviders),
    switchMap(() => {
      return this.service.getAll();
    }),
    tap((data) => {
      this.providerStore.set(data);
    })
  );

  @Effect()
  addProvider$ = this.action$.pipe(
    ofType(ProviderActions.addProvider),
    switchMap((provider) => this.service.addOne(provider)),
    tap((provider) => this.providerStore.add(provider))
  );
}
