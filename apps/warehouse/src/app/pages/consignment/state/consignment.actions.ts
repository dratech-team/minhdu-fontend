import { createAction, props } from '@datorama/akita-ng-effects';
import {AddConsignmentDto, SearchConsignmentDto, UpdateConsignmentDto} from '../dto';
import { ConsignmentEntity } from '../entities';

const addOne = createAction(
  '[CONSIGNMENT] Add One',
  props<AddConsignmentDto>()
);

const loadAll = createAction(
  '[CONSIGNMENT] Load All',
  props<SearchConsignmentDto>()
);

const getOne = createAction(
  '[CONSIGNMENT] Get One',
  props<{ id: ConsignmentEntity['id'] }>()
);

const update = createAction(
  '[CONSIGNMENT] Update',
  props<UpdateConsignmentDto>()
);

const remove = createAction(
  '[CONSIGNMENT] Delete',
  props<{ id: ConsignmentEntity['id'] }>()
);

const error = createAction(
  '[CONSIGNMENT] Error',
  props<{ error: string }>()
);

export const ConsignmentActions = { addOne, loadAll, getOne, update, remove, error };
