import { createAction, props } from '@ngrx/store';
import { Medicine } from './medicine.interface';



export const addMedicine = createAction(
  '[ADD_MEDICINE] Add Material',
  props<{ medicine: any }>()
);

export const loadInit = createAction(
  '[LOAD_MEDICINES] Load Init',
  props<{
    skip: number,
    take: number,
    name?: string,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_MEDICINES] Load Init Success',
  props<{ medicines: Medicine[] }>()
);

export const loadMoreMedicines = createAction(
  '[LOAD_MORE_MEDICINES] Load More Medicines',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMoreMedicinesSuccess = createAction(
  '[LOAD_MORE_MEDICINES] Load More Medicines Success',
  props<{ medicines: Medicine[] }>()
);

export const getMedicine = createAction(
  '[GET_MEDICINE] Get Medicine ',
  props<{ id: number }>()
);

export const getMedicineSuccess = createAction(
  '[GET_MEDICINE] Get Medicine Success',
  props<{ medicine: Medicine }>()
);

export const updateMedicine = createAction(
  '[UPDATE_MEDICINE] Update Medicine',
  props<{ medicine: any, id: number }>()
);


export const deleteMedicine = createAction(
  '[DELETE_MEDICINE] Delete Medicine',
  props<{ medicineId: number }>()
);

export const MedicineAction = {
  addMedicine,
  loadInit,
  loadInitSuccess,
  loadMoreMedicines,
  loadMoreMedicinesSuccess,
  getMedicine,
  getMedicineSuccess,
  updateMedicine,
  deleteMedicine
};

