import { createAction, props } from '@ngrx/store';
import { Ward } from '@minhdu-fontend/data-models';

export const loadAllWards = createAction(
  '[LOAD_WARDS] Load All Wards'
)

export const loadAllWardsSuccess = createAction(
  '[LOAD_WARDS] Load All Wards Success',
  props<{wards: Ward [] }>()
)

export const getWard= createAction(
  '[GET_WARD] Get Ward',
  props<{idWard: number}>()
)

export const getWardSuccess = createAction(
  '[GET_WARD] Get Ward Success',
  props<{ward: Ward}>()
)

export const getWardsByDistrictId = createAction(
  '[LOAD_WARD] Get Wards by DistrictId',
  props<{districtId: number}>()
)

export const getWardsByDistrictIdSuccess = createAction(
  '[LOAD_WARD] Get Wards by DistrictId Success',
  props<{wards: Ward[]}>()
)
export const WardAction = {
  getWard,
  getWardSuccess,
  loadAllWards,
  loadAllWardsSuccess,
  getWardsByDistrictId,
  getWardsByDistrictIdSuccess
}
