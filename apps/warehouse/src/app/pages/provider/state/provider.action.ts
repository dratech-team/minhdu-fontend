import { createAction, props } from '@datorama/akita-ng-effects';
import { AddProviderDto, UpdateProviderDto } from '../dto';
import { SearchProviderDto } from '../dto/search-provider.dto';

const addOne = createAction(
  '[PROVIDER] Add One',
  props<AddProviderDto>()
);

const loadAll = createAction(
  '[PROVIDER] Load All',
  props<SearchProviderDto>()
);

const update = createAction(
  '[PROVIDER] Update ',
  props<UpdateProviderDto>()
);

const remove = createAction(
  '[PROVIDER] Remove ',
  props<{ id: number }>()
);


export const ProviderActions = { addOne, loadAll, update, remove };
