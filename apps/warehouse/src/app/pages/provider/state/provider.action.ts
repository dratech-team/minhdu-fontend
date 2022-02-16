import { createAction, props } from '@datorama/akita-ng-effects';
import { ProviderDtoEntity } from '../entities/provider-dto.entity';

const addProvider = createAction(
  '[PROVIDER] Add Provider',
  props<{ name: ProviderDtoEntity['name'] }>()
);

const loadProviders = createAction('[PROVIDER] Load Providers');

export const ProviderActions = {
  addProvider,
  loadProviders
};
