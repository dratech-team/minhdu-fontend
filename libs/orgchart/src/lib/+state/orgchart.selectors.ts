import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ORGCHART_FEATURE_KEY,
  State,
  orgchartAdapter
} from './orgchart.reducer';

// Lookup the 'Orgchart' feature state managed by NgRx
export const getOrgchartState = createFeatureSelector<State>(
  ORGCHART_FEATURE_KEY
);

const { selectAll, selectEntities } = orgchartAdapter.getSelectors();

export const getOrgchartLoaded = createSelector(
  getOrgchartState,
  (state: State) => state.loaded
);

export const getOrgchartError = createSelector(
  getOrgchartState,
  (state: State) => state.error
);

export const getAllOrgchart = createSelector(getOrgchartState, (state: State) =>
  selectAll(state)
);

export const getOrgchartEntities = createSelector(
  getOrgchartState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getOrgchartState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getOrgchartEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
