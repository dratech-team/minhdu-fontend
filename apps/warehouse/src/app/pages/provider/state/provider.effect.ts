import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { ProviderStore } from './provider.store';
import { ProviderService } from '../services/provider.service';
import { ProviderActions } from './provider.action';
import { switchMap } from 'rxjs/operators';
import { tap } from 'lodash';

@Injectable()
export class ProviderEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ProviderService,
    private readonly providerStore: ProviderStore
  ) {
  }

  @Effect({ dispatch: false })
  loadProviders$ = this.action$.pipe(
    ofType(ProviderActions.loadProviders),
    switchMap(() => {
      return this.service.getAll();
    }),
    tap(data => {
      this.providerStore.set(data);
    })
  );
}
