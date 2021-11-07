import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EntityState } from '@ngrx/entity';
import { MenuSellEnum } from '@minhdu-fontend/enums';

export interface MainState extends EntityState<any> {
  tab: MenuSellEnum,
}

export const selectorMainState = createFeatureSelector<MainState>(
  FeatureName.MAIN
);

export const selectedTab = createSelector(
  selectorMainState,
  (state) => state.tab
);
