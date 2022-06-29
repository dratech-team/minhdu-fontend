import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  POSITION_FEATURE_KEY,
  positionAdapter,
  positionState,
} from './position.reducer';

export const getPositionState =
  createFeatureSelector<positionState>(POSITION_FEATURE_KEY);

const { selectAll } = positionAdapter.getSelectors();

export const getPositionLoaded = createSelector(
  getPositionState,
  (state: positionState) => state.loaded
);

export const getAllPosition = createSelector(
  getPositionState,
  (state: positionState) => selectAll(state)
);

export const selectPositionAdded = createSelector(
  getPositionState,
  (state: positionState) => state.added
);
