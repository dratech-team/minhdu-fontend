import * as fromWarehouse from './warehouse.reducer';
import { WarehouseState } from './warehouse.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';

export interface state {
  customer: WarehouseState,
}

const selectorState = createFeatureSelector<WarehouseState>(
  FeatureName.WAREHOUSE
);

export const selectLoading = createSelector(selectorState, state => state.loading);

export const selectProducts = createSelector(
  selectorState,
  fromWarehouse.selectAll
);
