import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Province } from '@minhdu-fontend/data-models';
import { createReducer, on } from '@ngrx/store';
import { ProvinceAction } from './nation.action';

export interface ProvinceState extends EntityState<Province> {
  loaded: boolean;
  selectedProvinceId: number;
}
export const adapterProvince: EntityAdapter<Province> =
  createEntityAdapter<Province>();
export const initialProvince = adapterProvince.getInitialState({
  loaded: false,
});

export const ProvinceReducer = createReducer(
  initialProvince,
  on(ProvinceAction.loadAllProvincesSuccess, (state, action) =>
    adapterProvince.setAll(action.provinces, { ...state, loaded: true })
  ),
  on(ProvinceAction.getProvinceSuccess, (state, action) =>
    adapterProvince.upsertOne(action.province, { ...state, loaded: true })
  )
);
export const { selectEntities, selectAll } = adapterProvince.getSelectors();
