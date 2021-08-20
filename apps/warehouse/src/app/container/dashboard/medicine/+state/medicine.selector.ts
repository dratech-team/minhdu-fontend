import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromMedicine from './medicine.reducer';
import { MedicineState } from './medicine.reducer';
import { Medicine } from './medicine.interface';


export interface state {
  customer: MedicineState,
}

export const getSelectedApplianceId = (state: Medicine) => state.id;
export const selectorMedicineState = createFeatureSelector<MedicineState>(
  FeatureName.MEDICINE
);
export const selectorMedicineEntities = createSelector(
  selectorMedicineState,
  fromMedicine.selectEntities
);

export const selectorAllMedicines = createSelector(
  selectorMedicineState,
  fromMedicine.selectAll
);

export const selectorCurrentMedicine = (id: number) => createSelector(
  selectorMedicineEntities,
  (MedicineEntities) => {
    return MedicineEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorMedicineState,
  (state) => state.loaded
);


