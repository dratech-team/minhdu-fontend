import { createAction, props } from '@datorama/akita-ng-effects';
import { ProviderEntity } from '../entities/provider.entity';

const addProvider = createAction(
  '[PROVIDER] Add Provider',
  props<{ provider: ProviderEntity }>()
);

const loadProviders = createAction('[PROVIDER] Load Providers');

export const ProviderActions = {
  addProvider,
  loadProviders
};
