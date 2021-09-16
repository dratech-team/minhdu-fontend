import { createAction, props } from '@ngrx/store';
import { District } from '@minhdu-fontend/data-models';

export const loadAllDistricts= createAction(
  '[LOAD_DISTRICTS] Load All Districts'
)

export const getDistrictsByProvinceId = createAction(
  '[LOAD_DISTRICT] Get Districts by ProvinceId',
  props<{provinceId: number}>()
)

export const getDistrictsByProvinceIdSuccess = createAction(
  '[LOAD_DISTRICT] Get Districts by ProvinceId Success',
  props<{districts: District[]}>()
)

export const loadAllDistrictsSuccess = createAction(
  '[LOAD_DISTRICTS] Load All Districts Success',
  props<{districts: District [] }>()
)

export const getDistrict= createAction(
  '[GET_DISTRICT] Get District',
  props<{idDistrict: number}>()
)

export const getDistrictSuccess = createAction(
  '[GET_DISTRICT] Get District Success',
  props<{district: District}>()
)
export const DistrictAction = {
  getDistrict,
  getDistrictSuccess,
  loadAllDistricts,
  loadAllDistrictsSuccess,
  getDistrictsByProvinceId,
  getDistrictsByProvinceIdSuccess
}
