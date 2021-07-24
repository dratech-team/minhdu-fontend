import { WardState } from './ward.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { Ward } from '@minhdu-fontend/data-models';
import * as fromWard from './ward.reducer';

export const SelectorWardState = createFeatureSelector<WardState>(
  FeatureName.WARD
);
export const getSelectedWardId = (state: Ward) => state.id;
export const getAllWard = createSelector(
  SelectorWardState,
  fromWard.selectAll
);
export const selectorWardEntities = createSelector(
  SelectorWardState,
  fromWard.selectEntities
);

export const selectorWardByDistrictId = (districtId: number) => createSelector(
  getAllWard,
  (wardEntities) => wardEntities.filter(ward => ward.districtId === districtId)
);

export const selectorCurrentWard = (id: number) => createSelector(
  selectorWardEntities,
  (wardEntities) => wardEntities[id]
);
export const selectedWardLoaded = createSelector(
  SelectorWardState,
  (state) => state.loaded
);
