import { createAction, props } from '@ngrx/store';
import { PoultryFood } from './poultry-food.interface';


export const addPoultryFood = createAction(
  '[ADD_POULTRY_FOOD] Add PoultryFood',
  props<{ poultryFood: any }>()
);

export const loadInit = createAction(
  '[LOAD_POULTRY_FOODS] Load Init',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_POULTRY_FOODS] Load Init Success',
  props<{ poultryFoods: PoultryFood[] }>()
);

export const loadMorePoultryFoods = createAction(
  '[LOAD_POULTRY_FOODS] Load More PoultryFood',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMorePoultryFoodsSuccess = createAction(
  '[LOAD_POULTRY_FOODS] Load More PoultryFood Success',
  props<{ poultryFood: PoultryFood[] }>()
);

export const getPoultryFood = createAction(
  '[GET_POULTRY_FOOD] Get PoultryFood ',
  props<{ id: number }>()
);

export const getPoultryFoodSuccess = createAction(
  '[GET_POULTRY_FOOD] Get PoultryFood Success',
  props<{ poultryFood: PoultryFood }>()
);

export const updatePoultryFood = createAction(
  '[UPDATE_POULTRY_FOOD] Update PoultryFood',
  props<{ poultryFood: any, id: number }>()
);


export const deletePoultryFood = createAction(
  '[DELETE_POULTRY_FOOD] Delete PoultryFood',
  props<{ poultryFoodId: number }>()
);

export const PoultryFoodAction = {
  addPoultryFood,
  loadInit,
  loadInitSuccess,
  loadMorePoultryFoods,
  loadMorePoultryFoodsSuccess,
  getPoultryFood,
  getPoultryFoodSuccess,
  updatePoultryFood,
  deletePoultryFood
};

