import { createFeatureSelector, createSelector } from '@ngrx/store';
import { POSITION_FEATURE_KEY, positionAdapter, positionState } from './position.reducer';

export const getPositionState = createFeatureSelector<positionState>(
  POSITION_FEATURE_KEY
);

const { selectAll, selectEntities } = positionAdapter.getSelectors();

export const getPositionLoaded = createSelector(
  getPositionState,
  (state: positionState) => state.loaded
);

export const getDepartmentError = createSelector(
  getPositionState,
  (state: positionState) => state.error
);

export const getAllPosition = createSelector(
  getPositionState,
  (state: positionState) => selectAll(state)
);

export const selectPositionLoaded = createSelector(
  getPositionState,
  (state: positionState) => state.loaded
);

export const selectPositionAdded = createSelector(
  getPositionState,
  (state: positionState) => state.added
);


 const getSelectedId = createSelector(
  getPositionState,
  (state: positionState) => state.selectedId
);

 //chưa sử dụng
export const getSelected = createSelector(
  getAllPosition,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
