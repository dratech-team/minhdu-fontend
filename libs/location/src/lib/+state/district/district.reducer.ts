import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { District, Ward } from '@minhdu-fontend/data-models';
import { createReducer, on } from '@ngrx/store';
import { DistrictAction } from './district.action';

export interface DistrictState extends EntityState<District> {
  loaded: boolean;
  selectedDistrictId: number;
}
export const adapter: EntityAdapter<District> = createEntityAdapter<District>();
export const initialDistrict = adapter.getInitialState({ loaded: false });

export const DistrictReducer = createReducer(
  initialDistrict,
  on(DistrictAction.loadAllDistrictsSuccess, (state, action) =>
    adapter.setAll(action.districts, { ...state, loaded: true })
  ),
  on(DistrictAction.getDistrictSuccess, (state, action) =>
    adapter.upsertOne(action.district, { ...state, loaded: true })
  ),
  on(DistrictAction.getDistrictsByProvinceIdSuccess, (state, action) =>
    adapter.upsertMany(action.districts, { ...state, loaded: true })
  )
);
export const { selectEntities, selectAll } = adapter.getSelectors();
