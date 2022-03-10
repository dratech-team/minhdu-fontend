import {createAction, props} from '@datorama/akita-ng-effects';
import {AddProviderDto} from "../dto/add-provider.dto";
import {ProviderDto} from "../dto/provider.dto";
import {UpdateProviderDto} from "../dto/update-provider.dto";

const addOne = createAction(
  '[PROVIDER] Add One',
  props<AddProviderDto>()
);

const loadAll = createAction(
  '[PROVIDER] Load All',
  props<{ param: ProviderDto, isScroll?: boolean }>()
);

const update = createAction(
  '[PROVIDER] Update ',
  props<{ id: number, body: UpdateProviderDto }>()
);

const remove = createAction(
  '[PROVIDER] Remove ',
  props<{ id: number }>()
);


export const ProviderActions = {addOne, loadAll, update, remove};
