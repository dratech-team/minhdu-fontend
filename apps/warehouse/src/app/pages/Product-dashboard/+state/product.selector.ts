import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formProduct from './product.reducer';
import { ProductState } from './product.reducer';
import { Product } from './product.interface';

export interface state {
  customer: ProductState,
}

export const getSelectedProductId = (state: Product) => state.id;
export const selectorProductState = createFeatureSelector<ProductState>(
  FeatureName.PRODUCT
);
export const selectorProductEntities = createSelector(
  selectorProductState,
  formProduct.selectEntities
);

export const selectorAllProduct = createSelector(
  selectorProductState,
  formProduct.selectAll
);

export const selectorCurrentPoultryFood = (id: number) => createSelector(
  selectorProductEntities,
  (ProductEntities) => {
    return ProductEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorProductState,
  (state) => state.loaded
);


