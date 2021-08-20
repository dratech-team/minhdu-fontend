import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MaterialAction } from './material.action';
import { Material } from './material.interface';

export interface MaterialState extends EntityState<Material> {
  loaded: boolean;
  selectedApplianceId: number
}

export const adapter: EntityAdapter<Material> = createEntityAdapter<Material>();

export const initialMaterial = adapter.getInitialState({ loaded: false });

export const MaterialReducer = createReducer(
  initialMaterial,
  on(MaterialAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.materials, { ...state, loaded: true })
  ),

  on(MaterialAction.loadMoreMaterialsSuccess, (state, action) =>
    adapter.addMany(action.materials, { ...state, loaded: true})
  ),

  on(MaterialAction.getMaterialSuccess, (state, action) =>
    adapter.upsertOne(action.material, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
