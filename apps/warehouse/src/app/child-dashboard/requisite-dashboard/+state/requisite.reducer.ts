import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { RequisiteAction } from './requisite.action';
import { Requisite } from './requisite .interface';

export interface RequisiteState extends EntityState<Requisite> {
  loaded: boolean;
  selectedProductId: number
}

export const adapter: EntityAdapter<Requisite> = createEntityAdapter<Requisite>();

export const initialProduct = adapter.getInitialState({ loaded: false });

export const RequisiteReducer = createReducer(
  initialProduct,
  on(RequisiteAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.requisite, { ...state, loaded: true })
  ),

  on(RequisiteAction.loadMoreRequisitesSuccess, (state, action) =>
    adapter.addMany(action.requisite, { ...state, loaded: true})
  ),

  on(RequisiteAction.getRequisiteSuccess, (state, action) =>
    adapter.upsertOne(action.requisite, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
