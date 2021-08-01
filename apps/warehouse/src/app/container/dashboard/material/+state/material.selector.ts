import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromMedicine from './material.reducer';
import { ApplianceState } from './material.reducer';
import { Appliance } from './material.interface';

export interface state {
  customer: ApplianceState,
}

export const getSelectedApplianceId = (state: Appliance) => state.id;
export const selectorApplianceState = createFeatureSelector<ApplianceState>(
  FeatureName.APPLIANCE
);
export const selectorApplianceEntities = createSelector(
  selectorApplianceState,
  fromMedicine.selectEntities
);

export const selectorAllAppliance = createSelector(
  selectorApplianceState,
  fromMedicine.selectAll
);

export const selectorCurrentAppliance = (id: number) => createSelector(
  selectorApplianceEntities,
  (CustomerEntities) => {
    return CustomerEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorApplianceState,
  (state) => state.loaded
);


