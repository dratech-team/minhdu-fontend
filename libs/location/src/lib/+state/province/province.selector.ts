import { ProvinceState } from './province.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { Province } from '@minhdu-fontend/data-models';
import * as fromProvince from './province.reducer';

export const SelectorProvinceState = createFeatureSelector<ProvinceState>(
  FeatureName.PROVINCE
);
export const getSelectedProvinceId = (state: Province) => state.id;
export const selectAllProvince = createSelector(
  SelectorProvinceState,
  fromProvince.selectAll
);
export const selectorProvinceEntities = createSelector(
  SelectorProvinceState,
  fromProvince.selectEntities
);
export const selectProvincesByNationId = (nationId: number) =>
  createSelector(selectAllProvince, (provinceEntities) =>
    provinceEntities.filter((province) => province.nationId === nationId)
  );
export const selectProvinceById = (id: number) =>
  createSelector(
    selectorProvinceEntities,
    (provinceEntities) => provinceEntities[id]
  );

export const selectedProvinceLoaded = createSelector(
  SelectorProvinceState,
  (state) => state.loaded
);
