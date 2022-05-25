import {createReducer, on, Action} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {Position} from '@minhdu-fontend/data-models';
import {PositionActions, updatePositionSuccess} from './position.actions';


export const POSITION_FEATURE_KEY = 'position';

export interface positionState extends EntityState<Position> {
  selectedId?: string | number;
  loaded: boolean;
  added: boolean;
  error?: string | null;
}

export interface PositionPartialState {
  readonly [POSITION_FEATURE_KEY]: positionState;
}

export const positionAdapter: EntityAdapter<Position> = createEntityAdapter<Position>();

export const initialState: positionState = positionAdapter.getInitialState({
  loaded: false, added: false
});
const positionReducer = createReducer(
  initialState,
  on(PositionActions.loadPosition, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(PositionActions.searchPosition, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(PositionActions.addPosition, (state) => ({
    ...state,
    added: false,
    error: null
  })),
  on(PositionActions.updatePosition, (state) => ({
    ...state,
    added: false,
    error: null
  })),

  on(PositionActions.updatePositionSuccess, (state, {position}) => (
    positionAdapter.updateOne({id: position.id, changes: position},
      {...state, added: true, error: null})
  )),
  on(PositionActions.loadPositionSuccess, (state, {position}) =>{
    return positionAdapter.setAll(position, {...state, loaded: true, added: true})
  }

  ),
  on(PositionActions.addPositionSuccess, (state, {position}) =>
    positionAdapter.addOne(position, {...state, loaded: true, added: true})
  ),
  on(PositionActions.loadPositionFailure, (state, {error}) => ({
    ...state,
    error
  }))
);

export function reducer(state: positionState | undefined, action: Action) {
  return positionReducer(state, action);
}
