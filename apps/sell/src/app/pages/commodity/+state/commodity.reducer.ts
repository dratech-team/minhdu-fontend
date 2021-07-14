import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Commodity } from './commodity.interface';
import { createReducer, on } from '@ngrx/store';
import { CommodityAction } from './commodity.action';


export interface CommodityState extends EntityState<Commodity> {
  loaded: boolean,
  selectedCommodityId: number
}

export const adapter: EntityAdapter<Commodity> = createEntityAdapter<Commodity>();

export const initialCommodity = adapter.getInitialState({ loaded: false });

export const CommodityReducer = createReducer(
  initialCommodity,

  on(CommodityAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.commodity, { ...state, loaded: true })),

  on(CommodityAction.loadMoreCommoditySuccess, (state, action) =>
    adapter.addMany(action.commodity, { ...state, loaded: true })),

  on(CommodityAction.getCommoditySuccess, (state, action) =>
    adapter.upsertOne(action.commodity, { ...state, loaded: true }))
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
