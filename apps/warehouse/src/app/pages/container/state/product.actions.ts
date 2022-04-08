import { createAction, props } from '@datorama/akita-ng-effects';
import {AddContainerDto, SearchContainerDto, UpdateContainerDto} from '../dto';
import { ContainerEntity } from '../entities';

const addOne = createAction(
  '[STOCK] Add One',
  props<AddContainerDto>()
);

const loadAll = createAction(
  '[STOCK] Load All',
  props<SearchContainerDto>()
);

const getOne = createAction(
  '[STOCK] Get One',
  props<{ id: ContainerEntity['id'] }>()
);

const update = createAction(
  '[STOCK] Update',
  props<UpdateContainerDto>()
);

const remove = createAction(
  '[STOCK] Delete',
  props<{ id: ContainerEntity['id'] }>()
);

const error = createAction(
  '[STOCK] Error',
  props<{ error: string }>()
);

export const ProductActions = { addOne, loadAll, getOne, update, remove, error };
