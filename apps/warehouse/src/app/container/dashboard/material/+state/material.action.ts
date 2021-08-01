import { createAction, props } from '@ngrx/store';
import { Appliance } from './material.interface';


export const addAppliance = createAction(
  '[ADD_APPLIANCE] Add Appliances',
  props<{ appliance: any }>()
);

export const loadInit = createAction(
  '[LOAD_APPLIANCES] Load Init',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_APPLIANCES] Load Init Success',
  props<{ appliances: Appliance[] }>()
);

export const loadMoreAppliances = createAction(
  '[LOAD_MORE_APPLIANCES] Load More Appliances',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMoreAppliancesSuccess = createAction(
  '[LOAD_MORE_APPLIANCES] Load More Appliances Success',
  props<{ appliances: Appliance[] }>()
);

export const getAppliance = createAction(
  '[GET_APPLIANCE] Get Appliance ',
  props<{ id: number }>()
);

export const getApplianceSuccess = createAction(
  '[GET_APPLIANCE] Get Appliance Success',
  props<{ appliance: Appliance }>()
);

export const updateAppliance = createAction(
  '[UPDATE_APPLIANCE] Update Appliance',
  props<{ appliance: any, id: number }>()
);


export const deleteAppliance = createAction(
  '[DELETE_APPLIANCE] Delete Appliance',
  props<{ applianceId: number }>()
);

export const MaterialAction = {
  addAppliance,
  loadInit,
  loadInitSuccess,
  loadMoreAppliances,
  loadMoreAppliancesSuccess,
  getAppliance,
  getApplianceSuccess,
  updateAppliance,
  deleteAppliance
};

