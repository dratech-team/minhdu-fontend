import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MaterialAction } from './material.action';
import { Appliance } from './material.interface';

export interface ApplianceState extends EntityState<Appliance> {
  loaded: boolean;
  selectedApplianceId: number
}

export const adapter: EntityAdapter<Appliance> = createEntityAdapter<Appliance>();

export const initialAppliance = adapter.getInitialState({ loaded: false });

export const MaterialReducer = createReducer(
  initialAppliance,
  on(MaterialAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.appliances, { ...state, loaded: true })
  ),

  on(MaterialAction.loadMoreAppliancesSuccess, (state, action) =>
    adapter.addMany(action.appliances, { ...state, loaded: true})
  ),

  on(MaterialAction.getApplianceSuccess, (state, action) =>
    adapter.upsertOne(action.appliance, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
