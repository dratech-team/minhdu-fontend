import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {  Position } from '@minhdu-fontend/data-models';
import { PositionActions } from './position.actions';


export const POSITION_FEATURE_KEY = 'position';

export interface positionState extends EntityState<Position> {
  selectedId?: string | number;
  loaded: boolean;
  error?: string | null;
}

export interface PositionPartialState {
  readonly [POSITION_FEATURE_KEY]: positionState;
}

export const positionAdapter: EntityAdapter<Position> = createEntityAdapter<Position>();

export const initialState: positionState = positionAdapter.getInitialState({
  loaded: false
});
const positionReducer = createReducer(
  initialState,
  on(PositionActions.loadPosition, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(PositionActions.loadPositionSuccess, (state, { position }) =>
    positionAdapter.setAll(position, { ...state, loaded: true })
  ),
  on(PositionActions.loadPositionFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: positionState | undefined, action: Action) {
  return positionReducer(state, action);
}
