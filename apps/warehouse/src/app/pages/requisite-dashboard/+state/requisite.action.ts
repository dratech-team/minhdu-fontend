import { createAction, props } from '@ngrx/store';
import { Requisite } from './requisite .interface';


export const addRequisite = createAction(
  '[ADD_REQUISITE] Add Requisite',
  props<{ requisite: any }>()
);

export const loadInit = createAction(
  '[LOAD_REQUISITES] Load Init',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_REQUISITES] Load Init Success',
  props<{ requisite: Requisite[] }>()
);

export const loadMoreRequisite = createAction(
  '[LOAD_REQUISITES] Load More Requisite',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMoreRequisitesSuccess = createAction(
  '[LOAD_REQUISITES] Load More Requisite Success',
  props<{ requisite: Requisite[] }>()
);

export const getRequisite = createAction(
  '[GET_REQUISITE] Get Requisite ',
  props<{ id: number }>()
);

export const getRequisiteSuccess = createAction(
  '[GET_REQUISITE] Get Requisite Success',
  props<{ requisite: Requisite }>()
);

export const updateRequisite = createAction(
  '[UPDATE_REQUISITE] Update Requisite',
  props<{ requisite: any, id: number }>()
);


export const deleteRequisite = createAction(
  '[DELETE_REQUISITE] Delete Requisite',
  props<{ requisiteId: number }>()
);

export const RequisiteAction = {
  addRequisite,
  loadInit,
  loadInitSuccess,
  loadMoreRequisitesSuccess,
  loadMoreRequisite,
  getRequisite,
  getRequisiteSuccess,
  updateRequisite,
  deleteRequisite
};

