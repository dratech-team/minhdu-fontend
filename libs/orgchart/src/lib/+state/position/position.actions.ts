import {  Position } from '@minhdu-fontend/data-models';
import { createAction, props } from '@ngrx/store';

export const loadPosition= createAction(
  '[Position/API] Load Position',
);

export const loadPositionSuccess = createAction(
  '[loadPosition/API] Load Position Success',
  props<{ position: Position[] }>()
);

export const addPosition = createAction(
  '[Position/API] Add Position',
  props<{ position: {name: string, departmentId: number, workday: number}}>()
);


export const updatePosition = createAction(
  '[Position/API] Update Position',
  props<{ id: number, name: string, workday: Date }>()
);

export const deletePosition = createAction(
  '[Position/API] Delete Position',
  props<{ id: number }>()
);
export const loadPositionFailure = createAction(
  '[Position/API] Load Position Failure',
  props<{ error: any }>()
);


export const PositionActions = {
  addPosition,
  loadPosition,
  loadPositionSuccess,
  loadPositionFailure,
  updatePosition,
  deletePosition,
};
