import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromMedicine from './appliance.reducer';
import { ApplianceState } from './appliance.reducer';
import { Appliance } from './appliance.interface';

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


