import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formSystemHistory from './system-history.reducer';
import { EntityState } from '@ngrx/entity';
import { SystemHistory } from './system-history.model';

export interface SystemHistoryState extends EntityState<SystemHistory> {
  loaded: boolean;
  selectedBillId: number;
}

export const selectorSystemHistoryState = createFeatureSelector<SystemHistoryState>(
  FeatureName.SYSTEM_HISTORY
);

export const selectorSystemHistoryEntities = createSelector(
  selectorSystemHistoryState,
  formSystemHistory.selectEntities
);
export const selectorAllSystemHistory = createSelector(
  selectorSystemHistoryState,
  formSystemHistory.selectAll
);

export const selectedSystemHistoryLoaded = createSelector(
  selectorSystemHistoryState,
  (state) => state.loaded
);

export const selectorSystemHistoryTotal = createSelector(
  selectorSystemHistoryState,
  formSystemHistory.selectTotal
);
