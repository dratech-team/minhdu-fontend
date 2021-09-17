import { SystemHistoryState } from './system-history.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formSystemHistory from './system-history.reducer';

export interface state {
  systemHistory: SystemHistoryState
}

export const selectorSystemHistoryState = createFeatureSelector<SystemHistoryState>(
  FeatureName.SYSTEM_HISTORY
);

export const selectorSystemHistoryEntities = createSelector(
  selectorSystemHistoryState,
  formSystemHistory.selectEntities
);
export const selectorAllBills = createSelector(
  selectorSystemHistoryState,
  formSystemHistory.selectAll
);

export const selectedLoaded = createSelector(
  selectorSystemHistoryState,
  (state) => state.loaded
);
