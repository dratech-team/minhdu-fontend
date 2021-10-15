import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ORGCHART_FEATURE_KEY,
  State,
  orgchartAdapter
} from './orgchart.reducer';
import { Branch } from '@minhdu-fontend/data-models';

// Lookup the 'Orgchart' feature state managed by NgRx
export const getOrgchartState = createFeatureSelector<State>(
  ORGCHART_FEATURE_KEY
);

export const getSelectedBranchId = (state: Branch) => state.id;

const { selectAll, selectEntities } = orgchartAdapter.getSelectors();
/**
 * @deprecated
 * */
export const getOrgchartError = createSelector(
  getOrgchartState,
  (state: State) => state.error
);


export const getAllOrgchart = createSelector(
  getOrgchartState,
  (state: State) => selectAll(state)
);

/**
 * @deprecated
 * */
export const getOrgchartEntities = createSelector(
  getOrgchartState,
  selectEntities
);
/**
 * @deprecated
 * */
export const getBranchById = (id: number) => createSelector(
  getOrgchartEntities,
  (branchEntities) => branchEntities[id]
);

export const getOrgchartLoaded = createSelector(
  getOrgchartState,
  (state: State) => state.loaded
);

export const getBranchAdded = createSelector(
  getOrgchartState,
  (state: State) => state.added
);
