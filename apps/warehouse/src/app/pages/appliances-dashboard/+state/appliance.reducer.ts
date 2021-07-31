import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ApplianceAction } from './appliance.action';
import { Appliance } from './appliance.interface';

export interface ApplianceState extends EntityState<Appliance> {
  loaded: boolean;
  selectedApplianceId: number
}

export const adapter: EntityAdapter<Appliance> = createEntityAdapter<Appliance>();

export const initialAppliance = adapter.getInitialState({ loaded: false });

export const ApplianceReducer = createReducer(
  initialAppliance,
  on(ApplianceAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.appliances, { ...state, loaded: true })
  ),

  on(ApplianceAction.loadMoreAppliancesSuccess, (state, action) =>
    adapter.addMany(action.appliances, { ...state, loaded: true})
  ),

  on(ApplianceAction.getApplianceSuccess, (state, action) =>
    adapter.upsertOne(action.appliance, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
