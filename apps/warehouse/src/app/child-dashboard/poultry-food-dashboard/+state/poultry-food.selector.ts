import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromPoultryFood from './poultry-food.reducer';
import { PoultryFoodState } from './poultry-food.reducer';
import { PoultryFood } from './poultry-food.interface';

export interface state {
  customer: PoultryFoodState,
}

export const getSelectedPoultryFoodId = (state: PoultryFood) => state.id;
export const selectorPoultryFoodState = createFeatureSelector<PoultryFoodState>(
  FeatureName.POULTRY_FOOD
);
export const selectorPoultryFoodEntities = createSelector(
  selectorPoultryFoodState,
  fromPoultryFood.selectEntities
);

export const selectorAllPoultryFood = createSelector(
  selectorPoultryFoodState,
  fromPoultryFood.selectAll
);

export const selectorCurrentPoultryFood = (id: number) => createSelector(
  selectorPoultryFoodEntities,
  (CustomerEntities) => {
    return CustomerEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorPoultryFoodState,
  (state) => state.loaded
);


