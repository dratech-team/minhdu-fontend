import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EntityState } from '@ngrx/entity';
import { MenuEnum, WarehouseTypeEnum } from '@minhdu-fontend/enums';

export interface MainState extends EntityState<any> {
  tab: MenuEnum,
  warehouse: WarehouseTypeEnum
}

export const selectorMainState = createFeatureSelector<MainState>(
  FeatureName.MAIN
);

export const selectedTab = createSelector(
  selectorMainState,
  (state) => state.tab
);

export const selectedWareHouse = createSelector(
  selectorMainState,
  (state) => state.warehouse
);

