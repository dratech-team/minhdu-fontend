
import { createAction, props } from '@ngrx/store';
import { District, Province } from '@minhdu-fontend/data-models';

export const loadAllProvinces = createAction(
  '[LOAD_PROVINCES] Load All Provinces'
)

export const loadAllProvincesSuccess = createAction(
  '[LOAD_PROVINCES] Load All Provinces Success',
  props<{provinces: Province [] }>()
)

export const getProvince= createAction(
  '[GET_PROVINCE] Get Province',
  props<{idProvince: number}>()
)

export const getProvinceSuccess = createAction(
  '[GET_PROVINCE] Get Province Success',
  props<{province: Province}>()
)

export const ProvinceAction = {
  loadAllProvinces,
  loadAllProvincesSuccess,
  getProvince,
  getProvinceSuccess
}
