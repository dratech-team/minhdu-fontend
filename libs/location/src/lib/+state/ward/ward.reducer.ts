import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {  Ward } from '@minhdu-fontend/data-models';
import { createReducer, on } from '@ngrx/store';
import { WardAction } from './ward.action';


export interface WardState extends EntityState<Ward>{
  loaded: boolean,
  selectedWardId: number,
}
export  const adapter: EntityAdapter<Ward> = createEntityAdapter<Ward>();
export const initialWard = adapter.getInitialState({ loaded: false, })

export const WardReducer = createReducer(
  initialWard,
  on(WardAction.loadAllWardsSuccess , (state, action) =>
  adapter.setAll(action.wards , {...state, loaded: true})
  ),
  on(WardAction.getWardSuccess , (state, action) =>
    adapter.upsertOne(action.ward , {...state, loaded: true})
  ),
  on(WardAction.getWardsByDistrictIdSuccess , (state, action) =>
    adapter.upsertMany(action.wards , {...state, loaded: true})
  )
)
export const {selectEntities, selectAll} = adapter.getSelectors()

