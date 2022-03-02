import {Position} from '@minhdu-fontend/data-models';
import {createAction, props} from '@ngrx/store';
import {UpdateNum} from "@ngrx/entity/src/models";

export const loadPosition = createAction(
  '[Position/API] Load Position'
);
export const searchPosition = createAction(
  '[Position/API] Search Position',
  props<{ position: string }>()
);

export const loadPositionSuccess = createAction(
  '[loadPosition/API] Load Position Success',
  props<{ position: Position[] }>()
);

export const addPosition = createAction(
  '[Position/API] Add Position',
  props<{ name: string, workday?: number,/* branchId?: number*/ }>()
);

export const addPositionSuccess = createAction(
  '[Position/API] Add Position Success',
  props<{ position: Position }>()
);

export const updatePosition = createAction(
  '[Position/API] Update Position',
  props<{ id: number, name: string, workday: Date, /*branchId: number */ }>()
);

export const updatePositionSuccess = createAction(
  '[Position/API] Update Position Success',
  props<{ position: UpdateNum<Position>}>()
);

export const deletePosition = createAction(
  '[Position/API] Delete Position',
  props<{ id: number, branchId?: number }>()
);

export const loadPositionFailure = createAction(
  '[Position/API] Load Position Failure',
  props<{ error: any }>()
);


export const PositionActions = {
  addPosition,
  addPositionSuccess,
  loadPosition,
  loadPositionSuccess,
  searchPosition,
  loadPositionFailure,
  updatePosition,
  updatePositionSuccess,
  deletePosition
};
