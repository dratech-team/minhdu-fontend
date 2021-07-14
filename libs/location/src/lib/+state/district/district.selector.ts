import { DistrictState } from './district.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { District } from '@minhdu-fontend/data-models';
import * as fromDistrict from './district.reducer';

export const SelectorDistrictState = createFeatureSelector<DistrictState>(
  FeatureName.DISTRICT
)
export const getSelectedDistrictId = (state: District) => state.id
export const getAllDistrict = createSelector(
  SelectorDistrictState,
  fromDistrict.selectAll
)
export const selectorDistrictEntities = createSelector(
  SelectorDistrictState,
  fromDistrict.selectEntities
)
export const selectCurrentDistrict = (id ?: number) => createSelector(
  selectorDistrictEntities,
  (districtEntities) => id?  districtEntities[id]: undefined
)
export const selectedDistrictLoaded = createSelector(
  SelectorDistrictState,
  (state) => state.loaded
);
