import { createAction, props } from '@ngrx/store';
import { Material } from './material.interface';


export const addMaterial = createAction(
  '[ADD_MATERIAL] Add Material',
  props<{ material: any }>()
);

export const loadInit = createAction(
  '[LOAD_MATERIALS] Load Init',
  props<{
    skip: number,
    take: number,
    name?:string
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_MATERIALS] Load Init Success',
  props<{ materials: Material[] }>()
);

export const loadMoreMaterials = createAction(
  '[LOAD_MORE_MATERIALS] Load More Materials',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMoreMaterialsSuccess = createAction(
  '[LOAD_MORE_MATERIALS] Load More Materials Success',
  props<{ materials: Material[] }>()
);

export const getMaterial = createAction(
  '[GET_MATERIAL] Get Material ',
  props<{ id: number }>()
);

export const getMaterialSuccess = createAction(
  '[GET_MATERIALGet] Material Success',
  props<{ material: Material }>()
);

export const updateMaterial = createAction(
  '[UPDATE_MATERIAL] Update Material',
  props<{ material: any, id: number }>()
);


export const deleteMaterial = createAction(
  '[DELETE_MATERIAL] Delete Material',
  props<{ materialId: number }>()
);

export const MaterialAction = {
  addMaterial,
  loadInit,
  loadInitSuccess,
  loadMoreMaterials,
  loadMoreMaterialsSuccess,
  getMaterial,
  getMaterialSuccess,
  updateMaterial,
  deleteMaterial
};

