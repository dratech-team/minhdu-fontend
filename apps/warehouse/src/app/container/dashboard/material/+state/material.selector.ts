import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromMedicine from './material.reducer';
import { MaterialState } from './material.reducer';
import { Material } from './material.interface';

export interface state {
  customer: MaterialState,
}

export const getSelectedApplianceId = (state: Material) => state.id;
export const selectorApplianceState = createFeatureSelector<MaterialState>(
  FeatureName.MATERIAL
);
export const selectorMaterialEntities = createSelector(
  selectorApplianceState,
  fromMedicine.selectEntities
);

export const selectorAllMaterial = createSelector(
  selectorApplianceState,
  fromMedicine.selectAll
);

export const selectorCurrentAppliance = (id: number) => createSelector(
  selectorMaterialEntities,
  (MaterialEntities) => {
    return MaterialEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorApplianceState,
  (state) => state.loaded
);


