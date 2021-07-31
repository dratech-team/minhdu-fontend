import { createAction, props } from '@ngrx/store';
import { Product } from './product.interface';


export const addProduct = createAction(
  '[ADD_PRODUCT] Add Product',
  props<{ product: any }>()
);

export const loadInit = createAction(
  '[LOAD_PRODUCTS] Load Init',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_PRODUCTS] Load Init Success',
  props<{ product: Product[] }>()
);

export const loadMoreProducts = createAction(
  '[LOAD_PRODUCTS] Load More PoultryFood',
  props<{
    skip: number,
    take: number,
  }>()
);

export const loadMoreProductsSuccess = createAction(
  '[LOAD_PRODUCTS] Load More PoultryFood Success',
  props<{ product: Product[] }>()
);

export const getProduct = createAction(
  '[GET_PRODUCT] Get PoultryFood ',
  props<{ id: number }>()
);

export const getProductSuccess = createAction(
  '[GET_PRODUCT] Get PoultryFood Success',
  props<{ product: Product }>()
);

export const updateProduct = createAction(
  '[UPDATE_PRODUCT] Update PoultryFood',
  props<{ product: any, id: number }>()
);


export const deleteProduct = createAction(
  '[DELETE_PRODUCT] Delete PoultryFood',
  props<{ productId: number }>()
);

export const ProductAction = {
  addProduct,
  loadInit,
  loadInitSuccess,
  loadMoreProducts,
  loadMoreProductsSuccess,
  getProduct,
  getProductSuccess,
  updateProduct,
  deleteProduct
};

