import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EntityState } from '@ngrx/entity';
import { MenuEnum } from '@minhdu-fontend/enums';

export interface adminState extends EntityState<any> {
  tab: MenuEnum,
}

export const selectorMainState = createFeatureSelector<adminState>(
  FeatureName.ADMIN
);

export const selectedTab = createSelector(
  selectorMainState,
  (state) => state.tab
);
