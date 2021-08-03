import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MedicineAction } from './medicine.action';
import { Medicine } from './medicine.interface';


export interface MedicineState extends EntityState<Medicine> {
  loaded: boolean;
  selectedApplianceId: number
}

export const adapter: EntityAdapter<Medicine> = createEntityAdapter<Medicine>();

export const initialMedicine = adapter.getInitialState({ loaded: false });

export const MedicineReducer = createReducer(
  initialMedicine,
  on(MedicineAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.medicines, { ...state, loaded: true })
  ),

  on(MedicineAction.loadMoreMedicinesSuccess, (state, action) =>
    adapter.addMany(action.medicines, { ...state, loaded: true})
  ),

  on(MedicineAction.getMedicineSuccess, (state, action) =>
    adapter.upsertOne(action.medicine, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
