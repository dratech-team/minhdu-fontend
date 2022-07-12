import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ORGCHART_FEATURE_KEY,
  orgchartAdapter,
  State,
} from './orgchart.reducer';
import { Branch } from '@minhdu-fontend/data-models';

// Lookup the 'branch' feature state managed by NgRx
export const getOrgchartState =
  createFeatureSelector<State>(ORGCHART_FEATURE_KEY);

const { selectAll, selectEntities } = orgchartAdapter.getSelectors();

export const getSelectedBranchId = (state: Branch) => state.id;

// chưa sử dụng
export const getOrgchartError = createSelector(
  getOrgchartState,
  (state: State) => state.error
);

export const getAllOrgchart = createSelector(getOrgchartState, (state: State) =>
  selectAll(state)
);

export const getLatestOrgchart = createSelector(
  getOrgchartState,
  (state: State) => selectAll(state)[selectAll(state).length - 1]
);

export const getOrgchartEntities = createSelector(
  getOrgchartState,
  selectEntities
);

export const getBranchById = (id: number | undefined) =>
  createSelector(getOrgchartEntities, (branchEntities) => {
    if (id) {
      return branchEntities[id];
    } else {
      return undefined;
    }
  });

export const getOrgchartLoaded = createSelector(
  getOrgchartState,
  (state: State) => state.loaded
);

export const getOrgchartTotal = createSelector(
  getOrgchartState,
  (state: State) => state.loaded
);

export const getBranchAdded = createSelector(
  getOrgchartState,
  (state: State) => state.added
);
