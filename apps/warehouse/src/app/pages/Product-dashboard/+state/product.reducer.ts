import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductAction } from './product.action';
import { Product } from './product.interface';

export interface ProductState extends EntityState<Product> {
  loaded: boolean;
  selectedProductId: number
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialProduct = adapter.getInitialState({ loaded: false });

export const ProductReducer = createReducer(
  initialProduct,
  on(ProductAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.product, { ...state, loaded: true })
  ),

  on(ProductAction.loadMoreProductsSuccess, (state, action) =>
    adapter.addMany(action.product, { ...state, loaded: true})
  ),

  on(ProductAction.getProductSuccess, (state, action) =>
    adapter.upsertOne(action.product, { ...state, loaded: true})
  ),
);
export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();
