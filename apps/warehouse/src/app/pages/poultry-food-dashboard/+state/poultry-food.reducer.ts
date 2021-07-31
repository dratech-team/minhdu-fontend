import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PoultryFoodAction } from './poultry-food.action';
import { PoultryFood } from './poultry-food.interface';

export interface PoultryFoodState extends EntityState<PoultryFood> {
  loaded: boolean;
  selectedPoultryFoodId: number
}

export const adapter: EntityAdapter<PoultryFood> = createEntityAdapter<PoultryFood>();

export const initialPoultryFood = adapter.getInitialState({ loaded: false });

export const PoultryFoodReducer = createReducer(
  initialPoultryFood,
  on(PoultryFoodAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.poultryFoods, { ...state, loaded: true })
  ),

  on(PoultryFoodAction.loadMorePoultryFoodsSuccess, (state, action) =>
    adapter.addMany(action.poultryFood, { ...state, loaded: true})
  ),

  on(PoultryFoodAction.getPoultryFoodSuccess, (state, action) =>
    adapter.upsertOne(action.poultryFood, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
