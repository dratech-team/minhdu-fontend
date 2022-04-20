import { createAction, props } from '@datorama/akita-ng-effects';
import {AddPositionDto} from "../dto";
import {SearchPositionDto} from "../dto";
import {LoadOnePositionDto} from "../dto";
import {UpdatePositionDto} from "../dto";
import {RemovePositionDto} from "../dto";

const addOne = createAction(
  '[POSITION] Add One',
  props<AddPositionDto>()
);

const loadAll = createAction(
  '[POSITION] Load All',
  props<SearchPositionDto>()
);

const loadOne = createAction(
  '[POSITION] Load One',
  props<LoadOnePositionDto>()
);

const update = createAction(
  '[POSITION] Update',
  props<UpdatePositionDto>()
);

const remove = createAction(
  '[POSITION] Remove',
  props<RemovePositionDto>()
);

const error = createAction(
  '[POSITION] Error',
  props<{ error: string }>()
);
export const PositionActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
