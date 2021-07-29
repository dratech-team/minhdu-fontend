import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as formWarehouse from './warehouse.reducer';
import { FeatureName } from '@minhdu-fontend/constants';
import { WarehouseState } from './warehouse.reducer';

export interface state {
  wareHouse: WarehouseState;
}

export const selectorWarehouseState = createFeatureSelector<WarehouseState>(
  FeatureName.WAREHOUSE
);

export const selectorWarehouseEntities = createSelector(
  selectorWarehouseState,
  formWarehouse.selectEntities
);

export const selectorAllWarehouses = createSelector(
  selectorWarehouseState,
  formWarehouse.selectAll
);
export const selectorCurrentWarehouse = (id: number) => createSelector(
  selectorWarehouseEntities,
  (BillEntities) => BillEntities[id]
);
export const selectedLoaded = createSelector(
  selectorWarehouseState,
  (state) => state.loaded
);
