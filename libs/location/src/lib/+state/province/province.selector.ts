import { ProvinceState } from './province.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import {  Province } from '@minhdu-fontend/data-models';
import * as fromProvince from './province.reducer';

export const SelectorProvinceState = createFeatureSelector<ProvinceState>(
  FeatureName.PROVINCE
)
export const getSelectedProvinceId = (state: Province) => state.id
export const getAllProvince = createSelector(
  SelectorProvinceState,
  fromProvince.selectAll
)
export const selectorProvinceEntities = createSelector(
  SelectorProvinceState,
  fromProvince.selectEntities
)
export const selectCurrentProvince = (id? : number) => createSelector(
  selectorProvinceEntities,
  (provinceEntities) => id? provinceEntities[id] : undefined
)
export const selectedProvinceLoaded = createSelector(
  SelectorProvinceState,
  (state) => state.loaded
);
