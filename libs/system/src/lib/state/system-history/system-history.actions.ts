import { createAction, props } from '@datorama/akita-ng-effects';
import { AddSystemHistoryDto } from '../../dto/system-history/add-system-history.dto';
import { SearchSystemHistoryDto } from '../../dto/system-history/search-system-history.dto';
import { LoadOneSystemHistoryDto } from '../../dto/system-history/load-one-system-history.dto';
import { UpdateSystemHistoryDto } from '../../dto/system-history/update-system-history.dto';
import { RemoveSystemHistoryDto } from '../../dto/system-history/remove-system-history.dto';

export const addOne = createAction(
  '[SYSTEM_HISTORY] Add One',
  props<AddSystemHistoryDto>()
);

export const loadAll = createAction(
  '[SYSTEM_HISTORY] Load All',
  props<SearchSystemHistoryDto>()
);

export const loadOne = createAction(
  '[SYSTEM_HISTORY] Load One',
  props<LoadOneSystemHistoryDto>()
);

export const update = createAction(
  '[SYSTEM_HISTORY] Update',
  props<UpdateSystemHistoryDto>()
);

export const remove = createAction(
  '[SYSTEM_HISTORY] Remove',
  props<RemoveSystemHistoryDto>()
);

export const error = createAction(
  '[SYSTEM_HISTORY] Error',
  props<{ err: string }>()
);

export const SystemHistoryActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
