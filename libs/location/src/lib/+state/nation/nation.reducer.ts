import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Nation } from '@minhdu-fontend/data-models';
import { createReducer, on } from '@ngrx/store';
import { NationAction } from './nation.action';

export interface NationState extends EntityState<Nation> {
  loaded: boolean;
  selectedNationId: number;
}
export const adapter: EntityAdapter<Nation> = createEntityAdapter<Nation>();
export const initialNation = adapter.getInitialState({ loaded: false });

export const NationReducer = createReducer(
  initialNation,
  on(NationAction.loadAllNationsSuccess, (state, action) =>
    adapter.setAll(action.nations, { ...state, loaded: true })
  ),
  on(NationAction.getNationSuccess, (state, action) =>
    adapter.upsertOne(action.nation, { ...state, loaded: true })
  )
);
export const { selectEntities, selectAll } = adapter.getSelectors();
